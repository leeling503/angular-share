import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { Component, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from "@angular/core";
import { UtilChanges, UtilChangesValue } from "share-libs/src/utils";
import { PerfixText } from "../../base/perfix-text.component";
import { DateMonth } from "../share-date-picker.model";

@Component({
    selector: 'share-date-month',
    templateUrl: './share-date-month.component.html',
    styleUrls: ['./share-date-month.component.less']
})
export class ShareDateMonthComponent extends PerfixText {
    @Input() inPlaceholder: string = "请选择";
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    @Input() modelMonth: string;
    /**关闭月历框是否自动选择*/
    @Input() inIfAuto: boolean = true;
    /**是否可选择 年 */
    @Input() inIfYear: boolean = false;//是否可选择 年
    /**是否设置默认值 */
    @Input() inIfDefualt: boolean = true;//设置默认值
    @Output() modelMonthChange: EventEmitter<string> = new EventEmitter();
    /**主框显示的（年）月份 */
    viewMonth: string;
    /**弹框显示的年份*/
    viewYear: number;
    overlayOpen: boolean = false;
    /**年 */
    yearValue: number;
    monthValue: number;
    dateMonth: DateMonth;
    /**月历表*/
    dateMonths: DateMonth[] = [
        { id: 1, value: '01', name: '一月' },
        { id: 2, value: '02', name: '二月' },
        { id: 3, value: '03', name: '三月' },
        { id: 4, value: '04', name: '四月' },
        { id: 5, value: '05', name: '五月' },
        { id: 6, value: '06', name: '六月' },
        { id: 7, value: '07', name: '七月' },
        { id: 8, value: '08', name: '八月' },
        { id: 9, value: '09', name: '九月' },
        { id: 10, value: '10', name: '十月' },
        { id: 11, value: '11', name: '十一月' },
        { id: 12, value: '12', name: '十二月' },
    ]

    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
        if (UtilChanges(changes, 'modelMonth')) {
            this.viewMonth = this.modelMonth;
            if (this.modelMonth) {
                let value = parseInt(this.modelMonth.split('-')[0]);
                if (value > 13) {
                    this.inIfYear = true;
                    this.viewYear = this.yearValue = value;
                    this.monthValue = parseInt(this.modelMonth.split('-')[1]);
                } else {
                    this.yearValue = null;
                    this.monthValue = value;
                }
                this.setDataMonth();
            } else {
                this.viewMonth = this.modelMonth = "";
                this.viewYear = this.yearValue = this.monthValue = null;
            }
        }
    }

    ngOnInit(): void {
        if (this.inIfDefualt && !this.modelMonth) {
            this.monthValue = new Date().getMonth() + 1;
            this.viewYear = new Date().getUTCFullYear();
            this.setDataMonth();
            Promise.resolve().then(() => {
                this.setModelMonth();
            })
        }
    }

    onToggleOpen() {
        this.overlayOpen = !this.overlayOpen;
    }

    /**设置选中的月份模型 */
    setDataMonth(month: DateMonth = undefined) {
        this.dateMonth = month || this.dateMonths.filter(e => e.id == this.monthValue)[0];
    }

    /**设置年和月份 , 并改变model */
    setModelMonth() {
        let month = this.dateMonth;
        this.yearValue = this.viewYear;
        this.viewMonth = this.modelMonth = this.inIfYear ? this.yearValue + '-' + month.value : month.value;
        if (!this.inIfYear) {
            this.viewMonth = month.name;
        }
        this.modelMonthChange.emit(this.modelMonth);
    }

    /**页面选择月份 */
    onSelectMonth(month: DateMonth) {
        this.setDataMonth(month);
        this.setModelMonth();
        this.closeOverlay();
    }

    autoSetMonth() {
        if (this.inIfAuto || (this.viewYear != this.yearValue && this.monthValue)) {
            this.yearValue = this.viewYear;
            this.setModelMonth();
        }
    }

    /**年份更改 */
    onGoYear(num: number) {
        this.viewYear = this.viewYear + num;
    }

    /**点击遮罩关闭 */
    onClose() {
        this.closeOverlay();
        this.autoSetMonth();
    }

    closeOverlay() {
        this.overlayOpen = false;
    }

    onClearValue() {
        this.viewMonth = this.modelMonth = "";
        this.dateMonth = this.yearValue = this.monthValue = null;
        this.modelMonthChange.emit(this.modelMonth);
    }
}