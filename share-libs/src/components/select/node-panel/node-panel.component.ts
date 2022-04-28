import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { UtilArray, UtilChanges, UtilIsEqual } from "share-libs/src/utils";
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
    /**能否父子项联动 */
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

    get someNull(): boolean {
        return this.activeOptions.some(e => e.value === '')
    }

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

    /**点击选项（可能进入子选项或者选中，用户自行添加的选项需要双击才能进入子项） */
    onClickOption(option: SelectOption) {
        let flag: boolean = !!option.children && option.children.length > 0;
        if ((!flag || !this.inSon) && option.value) {
            /**子项为空，或者不显示子项时,且该项不为空单击就选中 */
            this.onCheckOption(!option._check, option)
        } else if (!option._add) {
            /**子项不空，非用户自己添加单击进入子项*/
            this.activeChange(option)
        }
    }

    /**双击双击强制进入子项*/
    onDblClick(option: SelectOption) {
        /**不显示子项||不能添加||添加项未填写内容时，无法创建子项 */
        if (!this.inSon || !this.inAdd || !option.value) return;
        option.children = option.children || [];
        this.activeChange(option);
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
        this.superOptions = UtilArray.getAncestorsByValue(this.superOptions, sup, 'key')
    }

    /**激活选项变化 */
    activeChange(option: SelectOption) {
        this.activeOptions = option.children;
        this.superOptions.push(option);
    }

    /**添加选项 */
    onAddOption() {
        let flag = this.activeOptions.some(e => e.value === '')
        if (!flag) {
            this.activeOptions.push({ key: '', value: '', _add: true })
        }
    }

    /**用户添加结束 */
    onInputValueEnd(option: SelectOption) {
        option.key = option.value;
    }

    /**有选项选中改变 */
    private _checkChange(option: SelectOption) {
        /**是否是勾选 */
        let flag = option._check;
        if (this.inOne && this.checkOptions.length == 1 && !flag) {
            /**至少选择一个且选中只有一个时的去勾选勾选 */
            let checkOption = this.checkOptions[0];
            /**去勾选就是仅剩的已选项*/
            if (checkOption === option) {
                /**防止选框ngChanges事件不触发 */
                setTimeout(() => { option._check = true; }, 20);
                return;
            }
        }
        if (!this.inMulti && this.checkOptions && this.checkOptions.length) {
            /**单选时去掉所有已勾选 */
            this.checkOptions.forEach(e => { e._check = false; e._mix = false; this._setOptionState(e); });
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
        if (this.inGanged) {
            /**联动则子项全部设置为一样选中状态属性 */
            UtilArray.setItemValue(option.children, '_check', flag);
        }
        /**父项和自身 */
        let ancestors = UtilArray.getAncestorsByValue(this.inOptions, option, 'key');
        for (let i = ancestors.length - 1; i >= 0; i--) {
            let anc = ancestors[i], children = anc.children || [];
            if (this.inGanged) {
                // /联动时flag为false则父项和自身必为false，flag为true父类还需要判断其余子项
                anc._check = flag && children.every(e => e._check == true);
            }
            anc._mix = children.some(e => e._check == true) || children.some(e => e._mix == true);
        };
    }

    /**根据选中数组设置选项的状态 */
    private _setOptionsStateByCheckOption() {
        UtilArray.setItemValue(this.inOptions, '_check', false);
        UtilArray.setItemValue(this.inOptions, '_mix', false);
        this.checkOptions.forEach(e => {
            e._check = true;
            this._setOptionState(e);
        });
        this.checkOptions = this.getCheckOptionsByCheck();
    }

    /**获取选中ckeck状态为true的选项（如果联动获取父类后不要子类） */
    private getCheckOptionsByCheck(): SelectOptions {
        return UtilArray.getArrByValue(this.inOptions, '_check', true, this.inGanged);
    }
}