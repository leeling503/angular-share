import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from "@angular/core";
import { Util, UtilChange, UtilChanges, UtilChangesValue, UtilDate } from "share-libs/src/utils";
import { MadePerfix, MadePerfixOverlay } from "../../base";
import { utilDataCache } from "../../table/share-table.model";
import { DateMonth, MonthItem, MONTHS } from "../share-date-picker.model";

@Component({
    selector: 'share-date-month',
    templateUrl: './share-date-month.component.html',
    styleUrls: ['./share-date-month.component.less']
})
export class ShareDateMonthComponent extends MadePerfixOverlay {
    constructor(private el: ElementRef) {
        super();
        this.nativeEl = this.el.nativeElement;
    }
    @Input() inPlaceholder: string = "请选择";
    @Input() model: string;
    /**关闭月历框是否自动选择*/
    @Input() inAutoApply: boolean = true;
    /**是否可选择 年 */
    @Input() inIfYear: boolean = true;//是否可选择年
    /**是否设置默认值 */
    @Input() inIfDefualt: boolean = false;//设置默认值

    @Output() modelChange: EventEmitter<string> = new EventEmitter();
    /**弹出的model内容 */
    private emitModel: string;
    /**主框显示的（年）月份 */
    vModel: string;
    /**选中的月份数据 */
    curMonth: MonthItem;
    /**缓存记录上次确定了的月份 */
    private cacheMonth: MonthItem;

    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
        if (UtilChanges(changes, 'model') && !Util.ifEqual(this.model, this.emitModel)) {
            this.setValueByModel(this.model);
            this.setVModelMonth();
        }
        if (UtilChange.change(changes, 'inIfDefualt') && this.inIfDefualt && !this.model) {
            this.setDefualtValue();
            this.setVModelMonth();
            this._emitModel();
        }
    }

    ngOnInit(): void { }

    /**点击遮罩关闭 */
    onSureChange(flag?: boolean) {
        this.overlayOpen = false;
        if (this.inAutoApply || flag) {
            this.curMonth = this.cacheMonth;
            this._emitModel();
        } else {
            this.setVModelMonth()
        }
    }

    onClearValue() {
        this.curMonth = undefined;
        this.setVModelMonth();
        this._emitModel();
    }

    onMonthChange(month: MonthItem) {
        this.cacheMonth = month;
        this.setVModelMonth(month);
    }

    /**设置年月的值 */
    private setValueByModel(model: string) {
        if (model) {
            let values = model.split('-');
            let value = parseInt(values[0]);
            if (value > 13) {
                this.inIfYear = true;
                this.curMonth = { year: values[0], month: values[1] }
            } else {
                this.curMonth = { year: "", month: values[0] }
            }
        } else {
            this.curMonth = new MonthItem();
        }
    }

    /**设置默认值 */
    private setDefualtValue() {
        let date = new Date();
        this.curMonth = { year: date.getUTCFullYear(), month: UtilDate.getZero(date.getMonth() + 1) }
    }

    /**设置年和月份,并改变model */
    private setVModelMonth(m: MonthItem = this.curMonth) {
        this.vModel = this.emitModel = !m ? '' : this.inIfYear && m.year ? m.year + '-' + m.month : <string>m.month;
    }

    private _emitModel() {
        if (Util.ifEqual(this.model, this.emitModel)) return;
        Promise.resolve().then(() => {
            this.modelChange.emit(this.emitModel)
        })
    }
}