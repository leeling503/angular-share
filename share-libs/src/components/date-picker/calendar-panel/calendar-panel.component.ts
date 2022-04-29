import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilDate } from 'share-libs/src/utils/util-date';
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
    let d = this.today = new Date();
    this.date = new DateData(d.getFullYear(), d.getMonth() + 1, d.getDate(), d)
  }
  /**接受年月日 （2021-01-01） */
  @Input() inDate: string = "2021-10-05";
  @Input() inPara: ShareParaCalendar;
  /**多个日期范围选择 */
  @Input() inMulti: boolean = true;
  @Output() onChange: EventEmitter<DateData> = new EventEmitter();
  /**星期栏数据 */
  public WEEK: string[] = ['一', '二', '三', '四', '五', '六', '日'];
  /**今天日期对象 */
  private today: Date;
  /**组件日期对象 */
  date: DateData;
  /**选中激活的日期 */
  checkDate: DateData;
  /**第二个选中激活的日期 */
  checkBDate: DateData;
  /**悬停的日期 */
  hoverDate: DateData;
  /**日历 */
  calendar: DateData[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inDate) {
      this.setDate(this.inDate);
    }
  }

  ngOnInit() {
    this.calendar = this.generCalendar();
  }

  /**页面点击日期 */
  onClickDate(item: DateData) {
    /**未度过的日期不允许查看点击 */
    /**非当前页面展示月需要更新日历 */
    if (!item._curMonth) {
      this.date = item;
      this.calendar = this.generCalendar();
    }
    /**用户激活日期变更为点击日期 */
    this.setCheckDate(item);
    this.emitModel()
  }

  /**鼠标进入当前日期 */
  onEnterDate(item: DateData) {
    if (item.time < this.checkDate.time) { this.hoverDate = undefined; return; }
    if (this.inMulti && !this.checkDate || this.checkBDate) return;
    this.hoverDate = item;
  }

  private emitModel() {
    this.onChange.emit(this.checkDate);
  }

  private setCheckDate(item: DateData) {
    if (this.inMulti) {
      if (this.checkBDate) {
        this.checkDate = item;
        this.checkBDate = undefined;
        this.hoverDate = undefined;
      } else if (this.checkDate && item.time > this.checkDate.time) {
        this.checkBDate = item;
      } else {
        this.checkDate = item;
        this.hoverDate = undefined;
      }
    } else {
      this.checkDate = item;
    }
  }

  /**生成日历对象(需要自己赋值给日历变量) */
  private generCalendar(): DateData[] {
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
    return calendar
  }

  /**根据日期数据获得日期对象*/
  private setDate(date: string | Date): void {
    /**无效日期判断 */
    let d = !!new Date(date).getTime ? new Date(date) : new Date();
    this.date = new DateData(d.getFullYear(), d.getMonth() + 1, d.getDate(), this.today)
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
/**日期数据（对应每天的各种数据） */
class DateData {
  /**日期字符串*/
  date: string;
  /**对应的星期几 */
  week: number;
  /**年 */
  year: number;
  /**月份 (不需要+1处理)  */
  month: number;
  /**对应的第几天 */
  day: number;
  /**time */
  time: number;
  /**未来日子 */
  _future?: boolean;
  /**当月 */
  _curMonth?: boolean;
  /**当天 */
  _curDay?: boolean;
  /**激活的月份 */
  _activeMonth?: boolean;
  /**
   * @param y年份
   * @param m月份 12月对应12
   * @param d日期
   * @param cur当日时间
  */
  constructor(y: number, m: number, d: number, cur: Date = new Date()) {
    let date = new Date(`${y}-${m}-${d}`);
    let cd = cur.getDate(), cm = cur.getMonth() + 1, cy = cur.getFullYear();
    let dateStr = UtilDate.getStr(date);
    this.date = dateStr;
    this.year = y;
    this.month = m;
    this.day = d;
    this.time = date.getTime();
    this.week = date.getDay();
    this._future = cy < y ? true : cy > y ? false : cm < m ? true : cm > m ? false : cd < d ? true : false;
    this._curMonth = y == cy && cm == m;
    this._curDay = this._curMonth && cd == d;
  }

}