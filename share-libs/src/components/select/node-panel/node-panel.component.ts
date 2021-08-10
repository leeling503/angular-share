import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { UtilArrayGetAncestorsByValue, UtilArrayGetArrByValue, UtilArrayRemoveItem, UtilArraySetKeyValue, UtilChanges, UtilIsEqual } from "share-libs/src/utils";
import { SelectOption } from "../share-select.model";

@Component({
    selector: 'node-panel',
    templateUrl: './node-panel.component.html',
    styleUrls: ['./node-panel.component.less']
})
export class NodePanel {
    constructor() { }
    @Input() inCheckOptions: SelectOption[];
    @Input() inOptions: SelectOption[];
    @Output() onCheckChange: EventEmitter<SelectOption[]> = new EventEmitter();
    _allOptions: SelectOption[];
    superOptions: SelectOption[];
    activeOptions: SelectOption[];
    checkOptions: SelectOption[];
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

    onClickOption(option: SelectOption) {
        let flag: boolean = !!option.children && option.children.length > 0;
        if (!flag) {
            this.onCheckOption(!option._check, option)
        } else {
            this.activeChange(option)
        }
    }

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

    /**有选项选中改变 */
    _checkChange(option: SelectOption) {
        this._setOptionState(option);
        this.checkOptions = this.getCheckOptionsByCheck();
        this.onCheckChange.emit(this.checkOptions)
    }

    /**设置选项和其父类的状态 */
    private _setOptionState(option: SelectOption) {
        console.log('setOptionState');
        let flag = option._check;
        option._mix = false;
        let ancestors = UtilArrayRemoveItem(UtilArrayGetAncestorsByValue(this.inOptions, option, 'key'), option);
        UtilArraySetKeyValue(option.children, '_mix', false);
        UtilArraySetKeyValue(option.children, '_check', flag);
        for (let i = ancestors.length - 1; i >= 0; i--) {
            let anc = ancestors[i], children = anc.children || [];
            anc._check = children.every(e => e._check == true);
            if (anc._check) {
                continue;
            }
            anc._check = false;
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
    getCheckOptionsByCheck(): SelectOption[] {
        return UtilArrayGetArrByValue(this.inOptions, '_check', true, true);
    }
}