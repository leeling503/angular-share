import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from "@angular/core";
import { DateMonth } from "../share-date-picker.model";

@Component({
    selector: 'share-date-month',
    templateUrl: './share-date-month.component.html',
    styleUrls: ['./share-date-month.component.less']
})
export class ShareDateMonthComponent {
    @Input() inPlaceholder: string = "请选择";
    @ViewChild(CdkOverlayOrigin, { static: true }) cdkOverlayOrigin: CdkOverlayOrigin;
    @Input() modelMonth: string;
    /**关闭月历框是否自动选择*/
    @Input() inIfAuto: boolean = true;
    /**是否可选择 年 */
    @Input() inIfYear: boolean = false;//是否可选择 年
    @Input() inSetDefualt: boolean = true;//设置默认值
    @Output() modelMonthChange: EventEmitter<string> = new EventEmitter();
    viewMonth: string;
    viewYear: number;

    overlayOpen: boolean = false;
    monthValue: number;
    yearValue: number;
    monthValues: DateMonth[] = [
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

    ngOnInit(): void {
        if (this.inSetDefualt) {
            this.initMonth(false);
            Promise.resolve().then(() => {
                this.setModelMonth();
            })
        }
    }

    onToggleOpen() {
        this.overlayOpen = !this.overlayOpen;
        this.initMonth();
    }

    initMonth(openFlag: boolean = true) {
        let curMonth = this.monthValue || new Date().getMonth() + 1;
        let curYear = this.yearValue || new Date().getUTCFullYear();
        if (this.modelMonth) {
            let value = parseInt(this.modelMonth.split('-')[0]);
            if (value > 13) {
                this.yearValue = value;
                this.monthValue = parseInt(this.modelMonth.split('-')[1]) || curMonth;
                this.inIfYear = true;
            } else {
                this.yearValue = curYear;
                this.monthValue = value;
            }
        } else {
            if (this.inIfAuto || !openFlag) {
                this.monthValue = curMonth;
            }
            this.yearValue = curYear;
        }
        this.viewYear = this.yearValue;
    }

    setModelMonth(month: DateMonth = undefined) {
        month = month || this.monthValues.filter(e => e.id == this.monthValue)[0];
        this.yearValue = this.viewYear;
        this.viewMonth = this.modelMonth = this.inIfYear ? this.yearValue + '-' + month.value : month.value;
        if (!this.inIfYear) {
            this.viewMonth = month.name;
        }
        this.modelMonthChange.emit(this.modelMonth);
    }

    onSelectMonth(month: DateMonth) {
        this.monthValue = month.id;
        this.setModelMonth(month);
        this.closeOverlay();
    }

    autoSetMonth() {
        if (this.inIfAuto || (this.viewYear != this.yearValue && this.monthValue)) {
            this.yearValue = this.viewYear;
            this.setModelMonth();
        }
    }

    onGoYear(num: number) {
        this.viewYear = this.viewYear + num;
    }

    closeOverlay() {
        this.overlayOpen = false;
    }

    onClose() {
        this.closeOverlay();
        this.autoSetMonth();
    }

    onClearValue() {
        this.viewMonth = this.modelMonth = "";
        this.yearValue = this.monthValue = null;
        this.modelMonthChange.emit(this.modelMonth);
    }
}