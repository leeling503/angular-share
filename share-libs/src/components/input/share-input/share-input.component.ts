import { OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { Component, ElementRef, EventEmitter, Input, Output } from "@angular/core";
import { UtilChanges } from "share-libs/src/utils";
import { PerfixText } from "../../base/perfix-text.component";
import { TypeInput } from "../share-input.model";
/**基础输入框组件 */
@Component({
    selector: 'share-input',
    templateUrl: './share-input.component.html',
    styleUrls: ['./share-input.component.less'],
})
export class ShareInputComponent extends PerfixText implements OnChanges, OnDestroy {
    constructor(private el: ElementRef) {
        super();
        this.nativeEl = this.el.nativeElement;
    }
    private nativeEl: HTMLInputElement;
    private inputEl: HTMLInputElement;
    /**传过来的数据 */
    @Input() model: string | number;
    /**输入框类型*/
    @Input() inType: TypeInput = TypeInput.text;
    /**最小值 */
    @Input() inMin: number;//最小值
    /**最大值 */
    @Input() inMax: number;//最大值
    /**长度 */
    @Input() inLength: number = 0;
    @Input() inReg: RegExp;
    @Output('modelChange') update: EventEmitter<string | number> = new EventEmitter();
    public value: string;
    private emitModel: string | number;
    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
        /**emitModel 阻止输出0. 后传入后更改 */
        if (UtilChanges(changes, 'model') && this.model !== this.emitModel) {
            let model = this.model ?? '';
            this.value = model.toString();
        }
    }

    ngOnInit() { }

    ngAfterViewInit(): void {
        this.inputEl = this.nativeEl.querySelector('input')
    }

    /**输入有改变 */
    onElChange($event: string) {
        let value: string = this.getModelByType($event), num: number | string = value, type = this.inType, str = value;
        /**小数点和符号标识 */
        let pointFlag = value.includes('.'), signFlag = value.includes('-');
        if (this.inMin >= 0) {
            signFlag = false;
        }
        /**数字或者有设置最大最小就进入范围判断 */
        if (
            this.inMax || this.inMin ||
            type === TypeInput.number || type === TypeInput.int || type === TypeInput.plusInt) {
            /** value -0. 被解析为 -0 丢失小数点 */
            num = this.getValueByMix(value);
            /** value -0 被解析为0会丢失负号 */
            str = num.toString();
            /** 修正--小数点 */
            str = pointFlag && !str.includes('.') ? str + '.' : str;
            /** 修正--正负号 */
            str = signFlag && !str.includes('-') ? '-' + str : str;
        }
        this.value = ["", "-", "-0"].includes(value) ? value : str;
        this.model = ["", "-", "-0"].includes(value) ? value : num;
        console.log("输入框显示：", this.value, "输出数据：", this.model)
        Promise.resolve().then(res => {
            this.inputEl.value = this.value;
            this.emitModel = this.model;
            this.update.emit(this.model)
        })
    }

    /**对字符进行合规调整 （类型，长度） */
    private getModelByType(str: string): string {
        if (this.inReg) {
            let result = str.match(this.inReg);
            str = result && result.join('');
        }
        if (this.inType == TypeInput.number) {
            /**数字（正负小数） */
            let result = str.match(/^\-?(\d+\.)?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.int) {
            /**整数（正负）*/
            let result = str.match(/^\-?\d*/g);
            str = result && result.join('');
        } else if (this.inType == TypeInput.plusInt) {
            /**整数（正负）*/
            str = str.replace(/\D/g, '');
        } else if (this.inType == TypeInput.noNull) {
            /**不允许出现空格*/
            str = str.replace(/\s/g, '');
        }
        if (this.inLength > 0) {
            str = str.slice(0, this.inLength)
        }
        return str
    }

    /**最大最小值过滤  0 或者 -0*/
    private getValueByMix(str: string): number {
        let value = parseFloat(str);
        value = isNaN(value) ? 0 : value;
        if (value === 0) {
            value = str.includes('-') ? -0 : 0;
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
