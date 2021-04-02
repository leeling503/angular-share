import { Component, ElementRef, Input, OnInit } from "@angular/core";
import { promise } from "protractor";
import { InputType, ShareSize } from "./share-input.model";

@Component({
    templateUrl: './share-input.component.html',
    styleUrls: ['./share-input.component.less'],
    selector: 'share-input'
})
export class ShareInputComponent implements OnInit {
    constructor(private el: ElementRef) {
        this.nativeEl = this.el.nativeElement
    }
    checkedNames = [];
    private nativeEl: HTMLElement;
    private inputEl: HTMLInputElement;
    value: string;
    @Input() inputSize: ShareSize = "normal"
    @Input() inputType: InputType = "number"

    ngOnInit() {
        this.inputEl = this.nativeEl.querySelector('input');
        let that = this;
        let descriper = Object.getOwnPropertyDescriptor(this.inputEl.constructor.prototype, 'value');
        let getValue = descriper.get;
        let setValue = descriper.set;
        console.log(Object.defineProperty(this.inputEl.constructor.prototype, 'value', {
            configurable: true,
            enumerable: true,
            get: function () {
                return getValue.call(this);
            },
            set: function (value) {
                console.log(arguments, this);
                // $(this).trigger('valChange');
                setValue.call(this, ...arguments);
                if (value != "OK") {
                    that.inputEl.value = "OK"
                }
            }
        }))
    }

    eventKeyDown($event: KeyboardEvent) {
        console.log(this.value, this.inputEl.value);
        this.inputEl.value = "OK"
    }

    eventKeyUp($event: KeyboardEvent) {
        console.log(this.value, this.inputEl.value)
    }

    eventChange($event: KeyboardEvent) {
        console.log("change", this.inputEl.value);
        Promise.resolve().then(res => {
            this.inputEl.value = "OK"
        })
    }
}
