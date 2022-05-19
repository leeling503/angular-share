import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges } from "@angular/core";
import { UtilChangesValue } from "../utils";

/**input输入框禁止输入空格 */
@Directive({
    selector: '[no-null]'
})
export class InputNoNullDirective {
    @Input() ngModel: string;
    @Output() ngModelChange: EventEmitter<string> = new EventEmitter();
    constructor(private el: ElementRef) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChangesValue(changes, 'ngModel')) {
            this.changeValue()
        }
    }

    changeValue() {
        let value = this.ngModel.replace(/\s/g, '')
        this.el.nativeElement.value = value;
        new Promise((resolve, reject) => { resolve(value) }).then(res => {
            this.ngModelChange.emit(value)
        })
    }
}