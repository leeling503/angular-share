import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import {   UtilArray, UtilChanges, UtilIsEqual } from "share-libs/src/utils";
import { SelectOption, SelectOptions } from "../share-select.model";
/**
 * 多级node面板
 */
@Component({
    selector: 'node-select',
    templateUrl: './node-select.component.html',
    styleUrls: ['./node-select.component.less']
})
export class NodeSelect {
    constructor() { }
    /**所有选项 */
    @Input() private inOptions: SelectOptions;
    /**选中的选项 */
    @Input() private inCheckOptions: SelectOptions = []
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
    /**能否父子项关联 */
    @Input() public inGanged: boolean;
    /**是否显示子项展开按钮 */
    @Input() public inSon: boolean;
    @Output() public onCheckChange: EventEmitter<SelectOptions> = new EventEmitter();
    @Output() public onActiveChange: EventEmitter<SelectOption> = new EventEmitter();
    /**所有（选项避免inOptions延时传入为undefined导致的错误）*/
    public options: SelectOptions = []
    /**被选中选项（避免inCheckOptions延时传入为undefined导致的错误）*/
    private checkOptions: SelectOptions = [];
    /**发出的选中项 */
    private emitOptions: SelectOptions = [];

    public activeOption: SelectOption;
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inOptions')) {
            this.options = this.inOptions;
            this.setStateByCheckOption();
        }
        if (UtilChanges(changes, 'inCheckOptions') && !UtilIsEqual(this.emitOptions, this.inCheckOptions)) {
            this.checkOptions = this.emitOptions = this.inCheckOptions;
            this.setStateByCheckOption();
        }
    }

    /**设置选项状态 */
    setStateByCheckOption() {
        this._setOptionsStateByCheckOption();
        if (!this.inCheck || !this.inSon) return;
        this.checkOptions.forEach(e => this.setMixState(e));
    }

    /**设置选项勾选状态 */
    _setOptionsStateByCheckOption() {
        UtilArray.setItemValue(this.options, '_check', false);
        UtilArray.setItemValue(this.options, '_mix', false);
        UtilArray.setValueByOther(this.options, this.checkOptions, '_check', true, 'key');
        /**新增用户选项需要此操作，在去勾选后，点击取消后再次打开勾选状态正常 */
        UtilArray.setItemValue(this.checkOptions, '_check', true, this.inGanged ? undefined : '');
    }

    /**设置选项的mix状态 */
    setMixState(option: SelectOption) {
        let ancestors = UtilArray.itemRemove(UtilArray.getAncestorsByValue(this.options, option), option)
        for (let i = ancestors.length - 1; i >= 0; i--) {
            let el = ancestors[i], children = el.children || [];
            el._mix = false;
            if (this.inGanged) {
                el._check = UtilArray.every(children, true, '_check')
            }
            el._mix = UtilArray.some(children, true, '_check') || UtilArray.some(children, true, '_mix');
        }
    }

    /**flag=true表示点击整个节点 */
    onClickOptionNode(option: SelectOption, flag: boolean = false) {
        if (option._dis) return;
        event && event.stopPropagation();
        if (flag && this.inCheck && this.inActive) {
            /**无选框则表示点击选中 */
            this.activeOption = option;
            this.onActiveChange.emit(this.activeOption);
            return;
        }
        flag = !option._check;
        /**至少选择一个时，去勾选 */
        if (this.inOne && this.checkOptions.length == 1 && option._check) {
            let checkOption = this.checkOptions[0];
            /**父子项目联动时，取消单个子项的父项目在下方判断 */
            if (checkOption === option) {
                /**防止选框ngChanges事件不触发 */
                option._check = false;
                setTimeout(() => { option._check = true; }, 20);
                return;
            }
        }
        /**单选先去掉选中的勾选以及之前可能存在的mix状态 */
        if (!this.inMulti && this.checkOptions && this.checkOptions.length) {
            UtilArray.setItemValue(this.checkOptions, '_check', false, this.inGanged ? undefined : '');
            UtilArray.setItemValue(this.checkOptions, '_mix', false, this.inGanged ? undefined : '');
            /**更新父类的勾选和mix状态 */
            this.setMixState(this.checkOptions[0]);
        }
        option._check = flag;
        /**父子项联动时 */
        if (this.inGanged) {
            UtilArray.setItemValue([option], '_check', option._check)
            UtilArray.setItemValue([option], '_mix', false)
        }
        this.setMixState(option);
        this.checkOptions = UtilArray.getArrByValue(this.options, '_check', true, this.inGanged);
        /**至少选择一个时 */
        if (this.inOne && this.checkOptions.length == 0) {
            setTimeout(() => {
                this.onClickOptionNode(option);
            }, 20);
            return
        }
        this.emitCheckOptions();
    }

    /**打开子节点 */
    onOpenOptionChild(option: SelectOption) {
        event.stopPropagation();
        option.showChild = !option.showChild;
    }

    emitCheckOptions() {
        if (!UtilIsEqual(this.checkOptions, this.emitOptions)) {
            this.emitOptions = this.checkOptions;
            this.onCheckChange.emit(this.emitOptions);
        }
    }

    ngOnDestroy(): void { }
}