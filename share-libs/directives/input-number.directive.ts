import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: 'input[input-number] , input.input-number',
    host: {
        "(input)": 'input()'
    }
})
export class InputNumberDirective {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement;
    }
    private nativeEl: HTMLInputElement;
    @Input() min: number = -Infinity;
    @Input() max: number = Infinity;
    @Input() isInteger: boolean = true;
    @Input() isPositive: boolean = true;
    ngOnInit(): void {
        this.isPositive = this.min < 0 ? false : this.isPositive;
    }

    input() {
        let value: string | number = this.nativeEl.value;
        if (value == '') { return }
        if (this.isInteger) {
            value = value.replace(/[^\d-]/g, "");
        } else {
            value = value.replace(/[^\d.-]/g, "");
        }
        if (this.isPositive) {
            value = value.replace(/[^\d]/g, "");
        } else {
            value = value.replace(/[^\d.-]/g, "");
        }
        value = Number.parseFloat(value);
        value = this.max > value ? value : this.max;
        value = this.min < value ? value : this.min;
        this.nativeEl.value = value.toString();
    }
}