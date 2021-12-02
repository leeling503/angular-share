import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { STRS, UtilDateGetStr } from 'share-libs/src/utils/util-date';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-base',
  templateUrl: './calendar-base.component.html',
  styleUrls: ['./calendar-base.component.less']
})
export class ShareCalendarBaseComponent implements OnInit {

  constructor(private el: ElementRef) {
    this.elNative = this.el.nativeElement;
    this.elToday = UtilDateGetStr(this.today, "YYYY-MM-DD");
    this.setYearMonth();
  }
  /**接受年月 （2021-01） */
  @Input() inDate: string = "2021-10";
  @Output() onChange: EventEmitter<DateData> = new EventEmitter();
  /**组件节点*/
  elNative: HTMLElement;
  /**年月选择器节点 */
  elYearMonth: HTMLElement;
  WEEK: string[] = ['一', '二', '三', '四', '五', '六', '日'];
  /**组件日期对象 */
  date: Date = new Date();
  /**当前日期对应的年份 */
  curYear: number;
  /**当前日期对应的月份 */
  curMonth: number;
  /**当前日期对应的天数 */
  curDays: number;
  /**激活的日期 */
  activeDate: Date = new Date();
  /**今天日期对象 */
  today: Date = new Date();
  /**今天字符串对象 */
  elToday: string;
  /**日期 */
  get dateStr(): string {
    return UtilDateGetStr(this.activeDate, "YYYY-MM-DD")
  }
  /**日历 */
  calendar: DateData[] = []

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inDate) {
      this.setDate(this.inDate);
      this.setYearMonth()
    }
  }

  ngOnInit() {
    this.calendar = this.generCalendar();
  }

  ngAfterViewInit(): void {
    this.elYearMonth = this.elNative.querySelector('.calendar-ctr-date')
  }

  onElToToday() {
    this.setCalendar();
    this.activeDate = new Date();
  }

  onElDataCtr(num: number) {
    let month = this.curMonth + num, year = this.curYear;
    if (month <= 0) {
      month = 12;
      year = year - 1;
    } else if (month > 12) {
      month = 1;
      year = year + 1;
    }
    let date = year + '-' + (STRS[month] || month);
    this.setCalendar(date + '-01')
  }

  onElOpenPlan() {
  }

  onElCheckClick(flag) {

  }

  /**页面点击日期 */
  onClickDate(item: DateData) {
    /**未度过的日期不允许查看点击 */
    if (!item.ifPer) return;
    /**非当前页面展示月需要更新日历 */
    if (!item.ifCurMonth) {
      this.setCalendar(item.date)
    }
    /**用户激活日期变更为点击日期 */
    this.activeDate = new Date(item.date);
    this.onChange.emit(item);
  }

  /**根据日期对象生成日历 */
  setCalendar(date: string | Date = new Date()) {
    this.setDate(date);
    this.setYearMonth();
    this.calendar = this.generCalendar();
  }

  /**生成日历数据对象(需要自己赋值给日历变量) */
  generCalendar(): DateData[] {
    /**最后一天的数字 */
    let lastDays = this.getMonthLastDay(this.curYear, this.curMonth);
    /**得到月份的第一天日期字符串 */
    let fymd = UtilDateGetStr(this.date, 'YYYY-MM-' + '01');
    /**得到月份的最后天日期字符串 */
    let lymd = UtilDateGetStr(this.date, 'YYYY-MM-' + lastDays);
    /**始末日期对象*/
    let fDate = new Date(fymd), lDate = new Date(lymd);
    /**始末日期对象对应的星期数*/
    let fDay = fDate.getDay(), lDay = lDate.getDay();
    /**由于星期日为 0 需特殊处理 */
    fDay = fDay == 0 ? 7 : fDay;
    /**此段代码决定如果最后一天为星期日，不会后补7天 */
    // lDay = lDay == 0 ? 7 : lDay;
    /**上下个月补齐星期,需要补几个数*/
    let per = fDay - 1, next = 7 - lDay;
    /**此段代码决定如果1日为星期一，补齐前7天 */
    per = per == 0 ? 7 : per;
    /**上个月的年月和下个月的年月 */
    let perY, perM, perLastDays, nextY, nextM;
    if (per) {
      perM = this.curMonth - 1 > 0 ? this.curMonth - 1 : 12;
      perY = perM == 12 ? this.curYear - 1 : this.curYear;
      perLastDays = this.getMonthLastDay(perY, perM);
    }
    if (next) {
      nextM = this.curMonth + 1 > 12 ? 1 : this.curMonth + 1;
      nextY = nextM == 1 ? this.curYear + 1 : this.curYear;
    }
    let calendar: DateData[] = [];
    for (let i = per; i > 0; i--) {
      let data = this.generDateData(perY, perM, (perLastDays + 1) - i)
      calendar.push(data)
    }
    for (let i = 1; i <= lastDays; i++) {
      let data = this.generDateData(this.curYear, this.curMonth, i)
      calendar.push(data)
    }
    for (let i = 1; i <= next; i++) {
      let data = this.generDateData(nextY, nextM, i)
      calendar.push(data)
    }
    return calendar
  }

  /**生成日历对象   
   *@param y 年
   *@param m 月
   *@param d 日
   */
  generDateData(y: number, m: number, d: number): DateData {
    let dStr = STRS[d] || d;
    let mStr = STRS[m] || m;
    let date = new Date(`${y}-${mStr}-${dStr}`)
    let day = date.getDay(),
      days = date.getDate(),
      ifPer = this.today.getTime() > date.getTime(),
      dateStr = UtilDateGetStr(date, 'YYYY-MM-DD');
    let name = !ifPer ? '' : dateStr == this.elToday ? '今天' : "毛晓峰";

    let state: DateState = dateStr == this.elToday ? 'none' : ifPer && name ? 'normal' : ifPer ? 'abnormal' : 'none';
    return { date: dateStr, days, day, ifCurMonth: this.curMonth == m, ifPer, name, state }
  }


  /**根据日期数据获得日期对象*/
  setDate(date: string | Date): void {
    /**无效日期判断 */
    this.date = !!new Date(date).getTime ? new Date(date) : new Date();
  }

  /**设置年月日 */
  setYearMonth(date: Date = this.date): void {
    this.curYear = date.getFullYear();
    /**月份需要加一 */
    this.curMonth = date.getMonth() + 1;
    this.curDays = date.getDate()
  }

  /**
   * 获取当月最后一天
   *@param y 年
   *@param m 月
   */
  getMonthLastDay(y: number, m: number): number {
    if (m == 2) {
      /**闰年2月29天 */
      if ((!(y % 100) && !(y % 400)) || ((y % 100) && !(y % 4))) {
        return 29
      }
      return 28
    } else {
      return [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m]
    }
  }

}

type DateState = 'normal' | 'abnormal' | 'none';
/**日期数据（对应每天的各种数据） */
interface DateData {
  /**日期*/
  date?: string,
  /**对应的星期几 */
  day?: number,
  /**对应的第几天 */
  days?: number,
  /**是否是当前显示月 */
  ifCurMonth?: boolean,
  /**是否是今天 */
  ifCurDate?: boolean,
  /**是否已经度过 */
  ifPer?: boolean,
  /** */
  state?: DateState,
  /**值班人员 */
  name?: string,
  /**天气 */
  weather?: string,
}