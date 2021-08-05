import { STRING_TYPE } from "@angular/compiler";
import { OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { UtilChanges } from "share-libs/src/utils";
import { PerfixText } from "../base/perfix-text.component";
import { ShareSize, TypeInput } from "./share-input.model";

@Component({
    templateUrl: './share-input.component.html',
    styleUrls: ['./share-input.component.less'],
    selector: 'share-input'
})
export class ShareInputComponent extends PerfixText implements OnChanges, OnDestroy {
    constructor(private el: ElementRef) {
        super();
        this.nativeEl = this.el.nativeElement;
    }
    checkedNames = [];
    private nativeEl: HTMLInputElement;
    private inputEl: HTMLInputElement;
    @Input('ngModel') model: string;
    @Input() inType: TypeInput = TypeInput.text;
    @Input() inMin: number;//最小值
    @Input() inMax: number;//最大值
    @Input() inLength: number; //长度
    @Output('ngModelChange') update: EventEmitter<string> = new EventEmitter()
    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
    }

    ngOnInit() { }

    ngAfterViewInit(): void {
        this.inputEl = this.nativeEl.querySelector('input')
    }

    onEventChange($event: string) {
        this.model = this.getModelByType(this.inputEl.value);
        this.model = this.getModelByLength(this.model);
        this.inputEl.value = this.model;
        Promise.resolve().then(res => {
            this.update.emit(this.model)
        })
    }

    getModelByType(str: string): string {
        if (this.inType == TypeInput.number) {
            let result = str.match(/^\-?d*(\d+\.)?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.int) {
            let result = str.match(/^\-?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.plusInt) {
            str = str.replace(/\D/g, '');
        } else if (this.inType == TypeInput.noNull) {
            str = str.replace(/\s/g, '');
        }
        return str
    }

    getModelByLength(str: string): string {
        if (this.inLength > 0) {
            str = str.slice(0, this.inLength)
        }
        return str
    }

    ngOnDestroy(): void { }
}
