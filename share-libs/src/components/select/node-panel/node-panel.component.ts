import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { UtilArrayGetAncestorsByValue, UtilArrayGetArrByValue, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilChanges, UtilIsEqual } from "share-libs/src/utils";
import { SelectOption, SelectOptions } from "../share-select.model";
/**
 * 多级node面板
 */
@Component({
    selector: 'node-panel',
    templateUrl: './node-panel.component.html',
    styleUrls: ['./node-panel.component.less']
})
export class NodePanel {
    constructor() { }
    @Input() inCheckOptions: SelectOptions = [];
    @Input() inOptions: SelectOptions = [];
    /**各种有效配置 */
    /**是否多选 */
    @Input() public inMulti: boolean;
    /**无数据提示 */
    @Input() public inTip: string = '暂无数据';
    /**显示选框 */
    @Input() public inCheck: boolean;
    /**能否添加新选项 */
    @Input() public inAdd: boolean;
    /**是否有激活项 */
    @Input() public inActive: boolean
    /**至少选中一项 */
    @Input() public inOne: boolean;
    /**能否添加新选项 */
    @Input() public inGanged: boolean;
    /**是否显示子项展开按钮 */
    @Input() public inSon: boolean;
    @Output() onCheckChange: EventEmitter<SelectOptions> = new EventEmitter();
    /**激活项的父级选项 */
    public superOptions: SelectOptions;
    /**当前激活的选项 */
    public activeOptions: SelectOptions;
    /**选中的选项 */
    public checkOptions: SelectOptions;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inOptions')) {
            this.superOptions = [{ value: '全部', children: this.inOptions }]
            this.activeOptions = this.inOptions || [];
        }
        if (UtilChanges(changes, 'inCheckOptions') && !UtilIsEqual(this.inCheckOptions, this.checkOptions)) {
            this.checkOptions = this.inCheckOptions;
            this._setOptionsStateByCheckOption();
        }
    }

    /**点击选项（可能进入子选项或者选中） */
    onClickOption(option: SelectOption) {
        let flag: boolean = !!option.children && option.children.length > 0;
        if (!flag || !this.inSon) {
            this.onCheckOption(!option._check, option)
        } else {
            this.activeChange(option)
        }
    }

    ngAfterViewInit(): void { }

    onDblClick(option: SelectOption) {
        console.log(option)
    }

    /**选择选项 */
    onCheckOption(flag: boolean, option: SelectOption) {
        event.stopPropagation();
        option._check = flag;
        this._checkChange(option)
    }

    /**选中上级选项(不传将会回到最顶层) */
    onCheckSuper(sup: SelectOption) {
        this.activeOptions = sup && sup.children || [];;
        this.superOptions = UtilArrayGetAncestorsByValue(this.superOptions, sup, 'key')
    }

    /**激活选项变化 */
    activeChange(option: SelectOption) {
        this.activeOptions = option.children;
        this.superOptions.push(option);
    }

    onAddOption() {

    }

    /**用户添加结束 */
    onInputValueEnd(option: SelectOption) {
        option.key = option.value;
    }

    /**有选项选中改变 */
    private _checkChange(option: SelectOption) {
        /**是否是勾选 */
        let flag = option._check;
        /**至少选择一个时，去勾选 */
        if (this.inOne && this.checkOptions.length == 1 && !flag) {
            let checkOption = this.checkOptions[0];
            /**父子项目联动时，取消单个子项的父项目在下方判断 */
            if (checkOption === option) {
                /**防止选框ngChanges事件不触发 */
                setTimeout(() => { option._check = true; }, 20);
                return;
            }
        }
        if (!this.inMulti && this.checkOptions && this.checkOptions.length) {
            this.checkOptions.forEach(e => {
                e._check = false;
                e._mix = false;
                this._setOptionState(e)
            });
        }
        option._check = flag;
        this._setOptionState(option);
        this.checkOptions = this.getCheckOptionsByCheck();
        /**至少选择一个时 */
        if (this.inOne && this.checkOptions.length == 0) {
            setTimeout(() => {
                option._check = true;
                this._checkChange(option);
            }, 20);
            return
        }
        this.onCheckChange.emit(this.checkOptions)
    }

    /**设置选项和其父类的状态 */
    private _setOptionState(option: SelectOption) {
        let flag = option._check;
        UtilArraySetKeyValue(option.children, '_mix', false);
        if (this.inGanged) {
            UtilArraySetKeyValue(option.children, '_check', flag);
        }
        let ancestors = UtilArrayRemoveItem(UtilArrayGetAncestorsByValue(this.inOptions, option, 'key'), option);
        for (let i = ancestors.length - 1; i >= 0; i--) {
            let anc = ancestors[i], children = anc.children || [];
            if (this.inGanged) {
                anc._check = children.every(e => e._check == true);
            }
            anc._mix = children.some(e => e._check == true) || children.some(e => e._mix == true);
        };
    }

    /**根据选中数组设置选项的状态 */
    private _setOptionsStateByCheckOption() {
        UtilArraySetKeyValue(this.inOptions, '_check', false);
        UtilArraySetKeyValue(this.inOptions, '_mix', false);
        this.checkOptions.forEach(e => {
            e._check = true;
            this._setOptionState(e);
        });
        this.checkOptions = this.getCheckOptionsByCheck();
    }

    /**获取选中ckeck状态为true的选项（获取父类后不要子类） */
    private getCheckOptionsByCheck(): SelectOptions {
        return UtilArrayGetArrByValue(this.inOptions, '_check', true, this.inGanged ? true : false);
    }
}