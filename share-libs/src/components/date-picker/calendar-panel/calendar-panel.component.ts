import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { DateData } from '../share-date-picker.model';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.less']
})
export class ShareCalendarPanelComponent implements OnInit {

  constructor(private el: ElementRef) {
    this.setDate();
  }
  /**接受年月日 （2021-01-01） */
  @Input() inDate: string = "2021-10-05";
  @Input() inPara: ShareParaCalendar;
  /**多个日期范围选择 */
  @Input() inMulti: boolean = true;
  /**组件日期对象 */
  @Input() date: DateData;
  @Output() onChange: EventEmitter<DateData> = new EventEmitter();
  /**星期栏数据 */
  public WEEK: string[] = ['一', '二', '三', '四', '五', '六', '日'];

  /**选中激活的日期 */
  @Input() public showDateA: DateData;
  // @Output() public onCheckDateAChange: EventEmitter<DateData> = new EventEmitter();
  /**选中激活的日期 */
  @Input() public showDateB: DateData;
  // @Output() public onCheckDateAChange: EventEmitter<DateData> = new EventEmitter();
  /**选中激活的日期 */
  @Input() public checkDateA: DateData;
  @Output() public onCheckDateAChange: EventEmitter<DateData> = new EventEmitter();
  /**第二个选中激活的日期 */
  @Input() public checkDateB: DateData;
  @Output() public onCheckDateBChange: EventEmitter<DateData> = new EventEmitter();
  /**悬停的日期 */
  @Input() public hoverDate: DateData;
  @Output() public onHoverDateChange: EventEmitter<DateData> = new EventEmitter();
  /**日历面板 */
  public calendar: DateData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    /**面板日期 */
    if (changes.inDate) {
      this.setDate(this.inDate);
      this.generCalendar();
    }
  }

  ngOnInit() {
    this.generCalendar();
  }

  /**页面点击日期 */
  onClickDate(item: DateData) {
    /**未度过的日期不允许查看点击 */
    /**非当前页面展示月需要更新日历 */
    if (!item._curMonth) {
      this.date = item;
      this.generCalendar();
    }
    /**用户激活日期变更为点击日期 */
    this.setCheckDate(item);
    this.emitModel()
  }

  /**鼠标进入当前日期 */
  onEnterDate(item: DateData) {
    if (!this.checkDateA) return;
    if (item.time < this.checkDateA.time) { this.hoverDate = undefined; return; }
    if (this.inMulti && !this.checkDateA || this.checkDateB) return;
    this.hoverDate = item;
    this.onHoverDateChange.emit(this.hoverDate)
  }

  /**鼠标离开日历 */
  onLeaveCalendar() {
    this.hoverDate = undefined;
    this.onHoverDateChange.emit(this.hoverDate)
  }

  private emitModel() {
    this.onCheckDateAChange.emit(this.checkDateA);
    this.onCheckDateBChange.emit(this.checkDateB);
  }

  private setCheckDate(item: DateData) {
    if (this.inMulti) {
      if (this.checkDateB) {
        this.checkDateA = item;
        this.checkDateB = undefined;
        this.hoverDate = undefined;
      } else if (this.checkDateA && item.time >= this.checkDateA.time) {
        this.checkDateB = item;
      } else {
        this.checkDateA = item;
        this.hoverDate = undefined;
      }
    } else {
      this.checkDateA = item;
    }
  }

  /**根据date生成日历面板(需要自己赋值给日历变量) */
  private generCalendar(): void {
    let date = this.date, curYear = date.year, curMonth = date.month;
    /**最后一天的数字 */
    let lastDays = this.getMonthLastDay(curYear, curMonth);
    /**得到月份的第一天日期字符串 */
    let fymd = `${date.year}-${date.month}-01`;
    /**得到月份的最后天日期字符串 */
    let lymd = `${date.year}-${date.month}-${lastDays}`;
    /**始末日期对象*/
    let fDate = new Date(fymd), lDate = new Date(lymd);
    /**始末日期对象对应的星期数*/
    let fDay = fDate.getDay(), lDay = lDate.getDay();
    /**由于星期日为 0 需特殊处理 */
    fDay = fDay == 0 ? 7 : fDay;
    /**启用此代码则最后一天为星期日，不会后补7天 */
    // lDay = lDay == 0 ? 7 : lDay;
    /**上下个月补齐星期,需要补几个数*/
    let per = fDay - 1, next = 7 - lDay;
    /**此段代码决定如果1日为星期一，补齐前7天 */
    per = per == 0 ? 7 : per;
    /**上个月的年月和下个月的年月 */
    let perY, perM, perLastDays, nextY, nextM;
    if (per) {
      perM = curMonth - 1 > 0 ? curMonth - 1 : 12;
      perY = perM == 12 ? curYear - 1 : curYear;
      perLastDays = this.getMonthLastDay(perY, perM);
    }
    if (next) {
      nextM = curMonth + 1 > 12 ? 1 : curMonth + 1;
      nextY = nextM == 1 ? curYear + 1 : curYear;
    }
    let calendar: DateData[] = [], curDate = new Date(), d = 0;
    for (let i = per; i > 0; i--) {
      d++;
      let data = new DateData(perY, perM, (perLastDays + 1) - i, curDate);
      calendar.push(data)
    }
    for (let i = 1; i <= lastDays; i++) {
      d++;
      let data = new DateData(curYear, curMonth, i, curDate);
      data._activeMonth = true;
      calendar.push(data)
    }
    // for (let i = 1; i <= next; i++) {
    for (let i = 1; d < 42; d++, i++) {
      let data = new DateData(nextY, nextM, i, curDate)
      calendar.push(data)
    }
    this.calendar = calendar;
  }

  /**根据日期数据获得日期对象*/
  private setDate(date: string | Date = new Date()): void {
    /**无效日期判断 */
    let d = !!new Date(date).getTime ? new Date(date) : new Date();
    this.date = new DateData(d.getFullYear(), d.getMonth() + 1, d.getDate(), new Date())
  }

  /**
   * 获取当月最后一天
   *@param y 年
   *@param m 月
   */
  private getMonthLastDay(y: number, m: number): number {
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

export class ShareParaCalendar {

}
