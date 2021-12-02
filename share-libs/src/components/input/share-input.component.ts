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
    @Input() model: string | number;
    @Input() inType: TypeInput = TypeInput.text;
    @Input() inMin: number;//最小值
    @Input() inMax: number;//最大值
    @Input() inLength: number = 0; //长度
    @Output('modelChange') update: EventEmitter<string | number> = new EventEmitter();
    public value: string;
    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
    }

    ngOnInit() { }

    ngAfterViewInit(): void { this.inputEl = this.nativeEl.querySelector('input') }

    onEventChange($event: string) {
        let value: string = this.getModelByType(this.inputEl.value), num: number;
        let pointFlag = value.includes('.'), signFlag = value.includes('-');
        if (this.inMax || this.inMin || this.inType === TypeInput.number) {
            num = this.getValueByMix(value, signFlag);
        }
        let str = pointFlag ? num.toString() + '.' : num.toString();
        str = signFlag && !str.includes('-') ? '-' + str : str;
        this.value = value == "" || value == '-' || value == '-0' ? value : str;
        // this.model = value == "" || value == '-' || value == '-0' ? value : num;
        Promise.resolve().then(res => {
            this.inputEl.value = value == "" || value == '-' || value == '-0' ? value : str;
            // this.update.emit(this.model)
        })
    }

    /**对字符进行调整 */
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
        if (this.inLength > 0) {
            str = str.slice(0, this.inLength)
        }
        return str
    }

    getValueByMix(str: string, sign: boolean) {
        let value = parseFloat(str);
        value = isNaN(value) ? 0 : value;
        if (value === 0 && sign) {
            value = -0;
        }
        if (this.inMin) {
            value = value < this.inMin ? this.inMin : value
        }
        if (this.inMax) {
            value = value > this.inMax ? this.inMax : value
        }
        return value
    }

    ngOnDestroy(): void { }
}
