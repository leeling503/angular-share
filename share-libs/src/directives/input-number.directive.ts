import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
    selector: 'input[share-input-number] , input.share-input-number',
    host: {
        "(input)": 'input()'
    }
})
export class ShareInputNumberDirective {
    constructor(private el: ElementRef) {
        this.native = this.el.nativeElement;
    }
    private native: HTMLInputElement;
    @Input() min: number = -Infinity;
    @Input() max: number = Infinity;
    @Input() isInteger: boolean = true;
    @Input() isPositive: boolean = true;
    ngOnInit(): void {
        this.isPositive = this.min < 0 ? false : this.isPositive;
    }

    input() {
        let value: string | number = this.native.value;
        if (value == '') {
            return
        }
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
        this.native.value = value.toString();
    }
}