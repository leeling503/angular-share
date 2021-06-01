import { Directive, Input, ElementRef, SimpleChanges, OnChanges, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import 'daterangepicker';
import * as moment from 'moment';
import * as $ from 'jquery';
import { TimeRange } from './share-date-picker.model';
@Directive({
    selector: '[dateRangePicker]'
})
export class DateRangePickerDirective implements OnInit, OnChanges, OnDestroy {
    constructor(private elementRef: ElementRef) {
        this.el = this.el || this.elementRef.nativeElement;
    }
    @Input() inPickerOpt: daterangepicker.Options;
    @Input() el: HTMLElement;
    @Input() inShow: boolean;
    @Input() modelDay: string | TimeRange;
    @Output() modelDayChange: EventEmitter<string | TimeRange> = new EventEmitter();
    /**已经初始化 */
    initFlag: boolean = false;
    input: HTMLElement;
    private datepicker: any;
    private daterangepicker: daterangepicker;
    private dateRange: TimeRange;
    _single: boolean;

    ngOnChanges(changes: SimpleChanges): void { }

    ngOnInit(): void {
        $(this.el).on("click", () => {
            if (this.initFlag) { return };
            this.init();
            $(this.el).trigger('click.daterangepicker');
        })
    }

    private init() {
        this.initFlag = true;
        let opt = this.inPickerOpt;
        this._single = opt.singleDatePicker;
        this.datepicker = $(this.el).daterangepicker(opt, (start, end, label) => {
            console.log(start)
        });
        this.daterangepicker = $(this.el).data('daterangepicker');
        //根据开始日期和结束日期生成日期表
        let startDate = moment(opt.startDate || undefined).format(opt.locale.format);
        let endDate = moment(opt.endDate || undefined).format(opt.locale.format);
        this.daterangepicker.setStartDate(startDate);
        this.daterangepicker.setEndDate(endDate);
        if (opt.startDate) {
            this.dateRange = {
                start: startDate,
                end: endDate
            }
        }
        this.datepicker.on('show.daterangepicker', (ev, picker) => { })
        if (opt.autoApply) {
            this.datepicker.on('hide.daterangepicker', (ev, picker) => {
                this.changeTime(picker);
                this.destroyPicker();
            })
        } else {
            this.datepicker.on('apply.daterangepicker', (ev, picker: daterangepicker.DateRangePicker) => {
                this.changeTime(picker);
                this.destroyPicker();
            })
            this.datepicker.on('hide.daterangepicker', (ev, picker) => {
                // this.destroyPicker();
            })
        }
        this.datepicker.on('cancel.daterangepicker', (ev, picker) => {
            this.cancelTime();
        })
    }

    changeTime(picker: daterangepicker.DateRangePicker) {
        let format = this.inPickerOpt.locale.format;
        let start = picker.startDate.format(format);
        let end = picker.endDate.format(format);
        if (this.dateRange && this.dateRange.start == start && this.dateRange.end == end) {
            return;
        }
        this.dateRange = { start, end }
        let time = this._single ? this.dateRange.start : this.dateRange;
        this.modelDayChange.emit(time)
    }

    //取消选定时间
    cancelTime() {
        this.modelDayChange.emit(this.dateRange)
    }

    ngOnDestroy(): void {
        this.destroyPicker()
    }

    destroyPicker() {
        this.initFlag = false;
        this.daterangepicker && this.daterangepicker.remove();
        this.datepicker = null;
    }

}
