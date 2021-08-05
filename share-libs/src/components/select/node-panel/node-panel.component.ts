import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { UtilChanges } from "share-libs/src/utils";
import { SelectOption } from "../share-select.model";

@Component({
    selector: 'node-panel',
    templateUrl: './node-panel.component.html',
    styleUrls: ['./node-panel.component.less']
})
export class NodePanel {
    constructor() { }
    @Input() inAllOptions: SelectOption;
    @Output() onActiveChange: EventEmitter<SelectOption> = new EventEmitter();
    @Output() onCheckChange: EventEmitter<SelectOption> = new EventEmitter();
    _allOptions: SelectOption[];
    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChanges(changes, 'inAllOptions')) {
            this._allOptions = this.inAllOptions && this.inAllOptions.children || [];
        }
    }
    onClickOption(option: SelectOption) {
        let flag: boolean = !!option.children && option.children.length > 0;
        if (!flag) {
            this.onCheckOption(!option._check, option)
        } else {
            this.onActiveChange.emit(option)
        }
    }
    onCheckOption(flag: boolean, option: SelectOption) {
        event.stopPropagation();
        option._check = flag;
        this.onCheckChange.emit(option)
    }
}