import { Component, Input, Output, EventEmitter, ElementRef, SimpleChanges, HostListener } from "@angular/core";
import * as moment from 'moment';
import { TimeRange } from '../share-date-picker.model';
import { UtilChanges, UtilChangesHasValue, UtilChangesValue } from "share-libs/utils";
import { MadePerfix } from "../../base";
@Component({
    selector: 'share-date-day',
    templateUrl: './share-date-day.component.html',
    styleUrls: ['./share-date-day.component.less'],
})
export class ShareDateDayComponent extends MadePerfix {
    constructor(private elementRef: ElementRef) {
        super();
        this.el = this.elementRef.nativeElement;
    }
    el: HTMLElement;
    input: HTMLElement;
    /**初始时间 */
    @Input() modelDay: string | TimeRange;
    /**默认提示语 */
    @Input() inPlaceholder: string;
    /**是否是单日期选择器如果传入对象会强制改为双日期 boolean*/
    @Input() inIfSingle: boolean = true;
    /**是否自动确认日期 boolean*/
    @Input() inIfAutoApply: boolean = true;
    /**是否设置默认时间  boolean */
    @Input() inIfDefualt: boolean = true;
    /**日期控件配置 */
    @Input() inOptions: daterangepicker.Options = {};
    /**日期控件本地化 */
    @Input() inLocale: daterangepicker.Locale;
    /**使用默认范围选择 false*/
    @Input() inUseRanges: boolean = false;
    /**自定义范围选择*/
    @Input() inRanges;
    defaultOptions: daterangepicker.Options = {
        parentEl: 'body',//挂载节点
        showWeekNumbers: false,//true将会在选择面板显示本年第几周
        showISOWeekNumbers: false,//在日历的每周开始时显示ISO周数与 showWeekNumbers 极为类似
        showDropdowns: false,//是否显示年份和月份的下拉选择框
        minYear: 1900,//下拉选择框最小年份
        maxYear: 2100,//下拉选择框最大年份
        singleDatePicker: false,//单日期选择器
        timePicker: false,//小时和分钟选择器，需在local中设置format
        timePicker24Hour: false,//24小时制
        timePickerIncrement: 7,//分钟间隔
        timePickerSeconds: false,//秒选择器
        maxSpan: {
            days: 7
        },//日期范围选择器的最大间隔差day
        autoApply: true,//无选择器的情况下会隐藏“应用”和“取消”按钮，并在单击日期后自动应用新的日期范围
        buttonClasses: ['btn'],
        applyButtonClasses: 'btn-primary',
        cancelButtonClasses: 'btn-cancel',
        alwaysShowCalendars: true,//总是显示日历（有自定义ranges时）
        showCustomRangeLabel: false,//在预定义范围列表的末尾显示“自定义范围”
        linkedCalendars: true,//显示的两个日历始终为两个连续月份
        autoUpdateInput: true,//自动更新Input的值为所选日期
    };
    defaultRanges = {
        '过去1小时': [moment().subtract(1, 'hours'), moment()],
        '过去2小时': [moment().subtract(2, 'hours'), moment()],
        '过去3小时': [moment().subtract(3, 'hours'), moment()],
        '今天': [moment().startOf('day'), moment()],
        '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')]
    }
    defaultlocale: daterangepicker.Locale = {
        format: 'YYYY-MM-DD',//YYYY-MM-DD HH:mm
        applyLabel: '确认',
        cancelLabel: '取消',
        fromLabel: '从',
        toLabel: '到',
        weekLabel: '周',
        customRangeLabel: '自定义',
        firstDay: 1,
        daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    }
    @Output() modelDayChange: EventEmitter<string | TimeRange> = new EventEmitter();
    /**可视的时间日期数据 */
    viewVal: string;
    ngOnChanges(changes: SimpleChanges): void {
        super.ngPerfixChange(changes);
        /**异步更改 */
        if (UtilChangesValue(changes, 'modelDay')) {
            this.inIfSingle = typeof this.modelDay == 'string';
            this.setViewVal()
            this.init();
        }
    }

    ngOnInit(): void {
        this.init();
    }

    init() {
        let locale = Object.assign(this.defaultlocale, this.inLocale);
        this.inOptions = Object.assign(this.inOptions, { locale });
        let ranges = this.inRanges ? this.inRanges : this.inUseRanges == true ? this.defaultRanges : null;
        if (ranges) {
            this.inOptions = Object.assign(this.inOptions, { ranges });
        }
        this.inOptions = Object.assign({}, this.defaultOptions, this.inOptions);
        this.inOptions.singleDatePicker = this.inIfSingle;
        this.inPlaceholder = this.inPlaceholder || (this.inIfSingle ? '请选择日期' : '请选择日期范围')
        //设置默认值
        if (this.inIfDefualt) {
            if ((typeof this.modelDay == "object" && !this.modelDay.start) || !this.modelDay) {
                let now = moment().format(locale.format);
                let model = this.modelDay = this.inIfSingle ? now : { start: now, end: now, }
                Promise.resolve().then(() => {
                    this.modelDayChange.emit(model)
                })
            }
        }
        //判断是否选择了日期
        this.inOptions.autoApply = this.inIfAutoApply;//是否自动确认日期
        if (locale.format.includes('HH')) {
            this.inOptions.timePicker = true
        } else {
            this.inOptions.timePicker = false
        }
    }

    setViewVal() {
        let dateRange = this.modelDay, viewVal;
        if (typeof dateRange === 'string' || typeof dateRange === 'undefined') {
            viewVal = dateRange
            this.inOptions.startDate = dateRange;
            this.inOptions.endDate = dateRange;
        } else {
            viewVal = dateRange.start ? dateRange.start + ' - ' + dateRange.end : dateRange;
            this.inOptions.startDate = dateRange.start;
            this.inOptions.endDate = dateRange.end;
        }
        this.viewVal = viewVal;
    }

    onModelDayChange($event: any) {
        this.modelDay = $event;
        this.setViewVal();
        this.modelDayChange.emit(this.modelDay)
    }

    onClearValue() {
        this.onModelDayChange(undefined);
    }
}