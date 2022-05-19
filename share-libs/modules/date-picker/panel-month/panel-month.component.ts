import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from "@angular/core";
import { UtilChange, UtilChanges } from "share-libs/utils";
import { MadePanel } from "../../base";
import { DateMonth, MonthItem, MONTHS } from "../share-date-picker.model";

@Component({
    selector: "panel-month",
    templateUrl: './panel-month.component.html',
    styleUrls: ['./panel-month.component.less']
})
export class PanelMonthComponent extends MadePanel {
    @Input() model: string;
    /**是否可选择年 */
    @Input() ifYear: boolean = false;//是否可选择 年
    @Output() modelChange: EventEmitter<MonthItem> = new EventEmitter();
    @Output('onMonthChange') emitMonthChange: EventEmitter<MonthItem> = new EventEmitter();
    /**主框显示的（年）月份 */
    showMonth: MonthItem;
    dateMonth: DateMonth;
    months: DateMonth[] = MONTHS;

    ngOnChanges(changes: SimpleChanges): void {
        if (UtilChange.change(changes, 'model')) {
            this.setValue(this.model);
        }
    }

    ngOnInit(): void { }

    /**设置年月的值 */
    setValue(model: string) {
        let values = model.split('-');
        let value = parseInt(values[0]);
        if (value > 13) {
            this.ifYear = true;
            this.showMonth = { year: values[0], month: values[1] }
        } else {
            this.showMonth = { year: new Date().getFullYear(), month: values[0] }
        }
    }

    /**页面选择月份 */
    onSelectMonth(month: DateMonth) {
        this.dateMonth = month;
        this.showMonth.month = month.value;
        this._emitMonth();
    }

    /**年份更改 */
    onGoYear(num: number) {
        this.showMonth.year = <number>this.showMonth.year + num;
        this._emitMonth();
    }

    private _emitMonth() {
        this.emitMonthChange.emit(this.showMonth)
    }
}