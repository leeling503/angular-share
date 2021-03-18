import { Directive, Input, ElementRef, SimpleChanges, OnChanges, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import 'daterangepicker';
import * as moment from 'moment';
import * as $ from 'jquery';
import { TimeRange } from './share-date-picker.model';
@Directive({
    selector: '[appDateRangePicker]'
})
export class DateRangePickerDirective implements OnInit, OnChanges, OnDestroy {
    @Input() rangePickerOpt: daterangepicker.Options;
    @Input() el: HTMLElement;
    @Input() inClearView: Symbol;
    @Output() onDateChange: EventEmitter<TimeRange> = new EventEmitter();
    input: HTMLElement;
    private datepicker: any;
    private daterangepicker: daterangepicker;
    private dateRange: TimeRange;
    constructor(private elementRef: ElementRef) {
        this.el = this.el || this.elementRef.nativeElement;
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.inClearView && this.inClearView) {
            this.cancelTime();
        }
    }
    ngOnInit(): void {
        this.input = this.el.querySelector('input');
        this.init();
    }

    private init() {
        let opt = this.rangePickerOpt;
        this.datepicker = $(this.el).daterangepicker(opt, (start, end, label) => {
            console.log(start)
        });
        this.daterangepicker = $(this.el).data('daterangepicker');
        //根据开始日期和结束日期生成日期表
        let startDate = moment(opt.startDate || undefined).format(opt.locale.format);
        let endDate = moment(opt.endDate || undefined).format(opt.locale.format);
        this.daterangepicker.setStartDate(startDate);
        this.daterangepicker.setEndDate(endDate);

        if (!opt.startDate) {
            $(this.input).val('');
        } else {
            this.dateRange = {
                start: startDate,
                end: endDate
            }
            this.setViewVal()
        }
        this.datepicker.on('show.daterangepicker', (ev, picker) => { })
        if (opt.autoApply) {
            this.datepicker.on('hide.daterangepicker', (ev, picker) => { this.changeTime(picker) })
        } else {
            this.datepicker.on('hide.daterangepicker', (ev, picker) => { })
            this.datepicker.on('apply.daterangepicker', (ev, picker) => { this.changeTime(picker) })
        }
        this.datepicker.on('cancel.daterangepicker', (ev, picker) => { this.cancelTime() })
    }

    changeTime(picker, emit: boolean = true) {
        let format = this.rangePickerOpt.locale.format;
        let start = picker.startDate.format(format);
        let end = picker.endDate.format(format);
        if (this.dateRange && this.dateRange.start == start && this.dateRange.end == end) {
            return;
        }
        this.dateRange = { start, end }
        this.setViewVal(this.dateRange);
        if (emit) {
            this.onDateChange.emit(this.dateRange)
        }
    }

    //删除时间
    cancelTime() {
        let format = this.rangePickerOpt.locale.format;
        let now = moment().format(format);
        this.dateRange = { start: '', end: '' };
        this.daterangepicker.setStartDate(now);
        this.daterangepicker.setEndDate(now);
        this.setViewVal(null);
        this.onDateChange.emit(this.dateRange)
    }

    setViewVal(dateRange: TimeRange = this.dateRange) {
        let viewVal = !dateRange ? '' : this.rangePickerOpt.singleDatePicker || !dateRange.start ? dateRange.start : dateRange.start + ' - ' + dateRange.end;
        if (this.input) {
            $(this.input).val(viewVal);
        } else {
            setTimeout(() => {
                $(this.input).val(viewVal);
            }, 10);
        }
    }

    ngOnDestroy(): void {
        this.datepicker = null;
    }

}
