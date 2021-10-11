import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { UtilArrayClear, UtilArrayCopy, UtilArrayIsNonNull, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilArraysGetSpareArr, UtilArraysSetValueByOther, UtilChanges, UtilIsEqual } from "share-libs/src/utils";
import { SelectOption, SelectOptions } from "../share-select.model";
/**
 * 多级node面板
 */
@Component({
    selector: 'node-add',
    templateUrl: './node-add.component.html',
    styleUrls: ['./node-add.component.less']
})
export class NodeAdd {
    constructor() { }
    /**所有选项 */
    @Input() private inOptions: SelectOptions;
    /**选中的选项 */
    @Input() private inCheckOptions: SelectOptions = []
    /**各种有效配置 */
    /**是否多选 */
    @Input() private inIfMulti: boolean = false;
    /**能否添加新选项 */
    @Input() public inIfAdd: boolean = true;
    /**用户确定或取消勾选操作*/
    @Output() private onCheckSureChange: EventEmitter<boolean> = new EventEmitter();
    /**所有（选项避免inOptions延时传入为undefined导致的错误）*/
    public options: SelectOptions = []
    /**被选中选项（避免inCheckOptions延时传入为undefined导致的错误）*/
    private checkOptions: SelectOptions = [];
    /**用户自行添加的选项 */
    public addOptions: SelectOptions = [];
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inOptions')) {
            this.options = this.inOptions;
            /**将选项中没有的选中项添加至用户添加项 */
            this.addOptions = UtilArraysGetSpareArr(this.checkOptions, this.options, 'key');
        }
        if (UtilChanges(changes, 'inCheckOptions')) {
            this.checkOptions = this.inCheckOptions;
            this._setOptionsStateByCheckOption();
            /**将选项中没有的选中项添加至用户添加项 */
            this.addOptions = UtilArraysGetSpareArr(this.checkOptions, this.options, 'key');
        }
    }

    /**设置选项的勾选状态 */
    _setOptionsStateByCheckOption() {
        UtilArraySetKeyValue(this.options, '_check', false);
        UtilArraysSetValueByOther(this.options, this.checkOptions, '_check', true, 'key')
        /**新增用户选项需要此操作，在去勾选后，点击取消后再次打开勾选状态正常 */
        UtilArraySetKeyValue(this.checkOptions, '_check', true);
    }

    /**选项勾选状态改变，选中项改变 */
    onOptionCheck(flag: boolean, option: SelectOption) {
        if (!this.inIfMulti) {
            /**单选 */
            UtilArraySetKeyValue(this.checkOptions, '_check', false);
            this.checkOptions = UtilArrayClear(this.checkOptions);
        }
        if (flag) {
            this.checkOptions.push(option);
        } else {
            UtilArrayRemoveItem(this.checkOptions, option)
        }
        option._check = flag;
    }

    /**添加选项 */
    onAddOption() {
        let flag = this.addOptions.some(e => e.value === '')
        if (!flag) {
            this.addOptions.push({ key: '', value: '' })
        }
    }

    /**用户添加结束 */
    onInputValueEnd(option: SelectOption) {
        option.key = option.value;
    }

    /**是否确定改变选项 */
    onBtnClick(flag: boolean = false) {
        this.onCheckSureChange.emit(flag)
    }

    ngOnDestroy(): void { }
}