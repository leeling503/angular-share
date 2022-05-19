import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilArray, UtilDate, UtilStr } from 'share-libs/utils';
import { Calendar, CalendarItem, CalendarTime, CheckDateChangeItem, ShareParaCalendar } from '../share-date-picker.model';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-base',
  templateUrl: './calendar-base.component.html',
  styleUrls: ['./calendar-base.component.less']
})
export class ShareCalendarBaseComponent implements OnInit {

  constructor() { }
  /**接受年月日 （2021-01-01） */
  private defaultPara: ShareParaCalendar = {
    ifSingle: false,
    ifDefualt: false,
    ifLink: true,
    ifMulti: true,
    showTimePicker: true,
    showSecondPicker: true,
    showWeekNumbers: false,
    maxRange: 7,
    intervalMinute: 5,
    intervalSecond: 5,
  }
  @Input() inPara: ShareParaCalendar;
  @Input() model: string | string[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output('onCalendarChange') onCalendarChange: EventEmitter<Calendar> = new EventEmitter();
  @Output('onSureCheck') emitSureCheck: EventEmitter<boolean> = new EventEmitter();
  @Input() public ifSingle: boolean;
  @Input() public ifDefualt: boolean;
  @Input() public ifLink: boolean;
  @Input() public ifMulti: boolean;
  @Input() public timePicker: boolean;
  @Input() public secondPicker: boolean;
  @Input() public weekNumbers: boolean;
  @Input() public intervalMinute: number;
  @Input() public intervalSecond: number;
  @Input() public autoApply: boolean;
  /**选中的第一个日期 */
  public dateA: CalendarItem;
  /**选中的第二个日期 */
  public dateB: CalendarItem;
  /**显示的第一个日历 */
  public showA: CalendarItem;
  /**显示的第二个日历 */
  public showB: CalendarItem;
  public hoverDate: CalendarItem;
  /**时分秒 */
  public timeA: CalendarTime;
  public timeB: CalendarTime;
  /**自身抛出的数据 */
  private emitDate: Calendar;
  ngOnChanges(changes: SimpleChanges): void {
    if (this.emitDate) return;
    if (changes.inPara) {
      this.setPara();
    }
    if (changes.model) {
      this.setDateByModel();
      this._emitCalendar();
    }
    if (changes.inDefualt && this.ifDefualt && !this.dateA) {
      this.dateA = this.getDate();
      this.dateB = this.getDate();
    }
  }

  ngOnInit() {
    this.setPara();
    this.showA || this.setDateByModel();
  }


  /**根据传入设置日历设置所需的数据
   * 面板显示的日期 
   * 选中的日期
   * 选中的时间
   */
  setDateByModel(): void {
    let dateA, dateB, showA: CalendarItem, showB: CalendarItem, model = this.model;
    if (UtilArray.isArray(model)) {
      dateA = model[0], dateB = model[1];
    } else {
      model = UtilStr.split(model, '~');
      dateA = model[0], dateB = dateB = model[1];
    }
    showA = this.getDate(dateA); showB = this.getDate(dateB);
    /**需要考虑年份故用此判断 */
    if (!(showB.month > showA.month && showB.time > showA.time) || this.ifLink) {
      showB = new CalendarItem(showA.year, showA.month + 1);
    }
    let timeA: Date = UtilDate.ifValid(dateA) ? new Date(dateA) : this.ifDefualt ? new Date() : undefined;
    let timeB: Date = UtilDate.ifValid(dateB) ? new Date(dateB) : timeA;
    this.showA = showA; this.showB = showB;
    this.dateA = this.ifDefualt || UtilDate.ifValid(dateA) ? this.getDate(dateA) : undefined;
    this.dateB = UtilDate.ifValid(dateB) ? this.getDate(dateB) : this.ifDefualt ? this.dateA : undefined;
    this.timeA = timeA ? {
      hour: UtilDate.getZero(timeA.getHours()),
      miute: UtilDate.getZero(timeA.getMinutes()),
      second: UtilDate.getZero(timeA.getSeconds()),
    } : {};
    this.timeB = timeB ? {
      hour: UtilDate.getZero(timeB.getHours()),
      miute: UtilDate.getZero(timeB.getMinutes()),
      second: UtilDate.getZero(timeB.getSeconds()),
    } : {};
  }

  /**子组件通知显示月份变更 */
  onShowChange(date: CalendarItem, part: number) {
    if (!date._monthInc) return;
    this.setShowMonthCtr(part, date._monthInc)
  }

  /**日期选定 */
  onChangeDate(date: CheckDateChangeItem) {
    this.dateA = date.A; this.dateB = date.B;
    this._emitCalendar();
  }

  /**悬浮改变 */
  onChangeHoverDate(date: CalendarItem) {
    this.hoverDate = date
  }

  /**事件选定 */
  onTimeChange(time: CalendarTime, part: number) {
    let model: string = "";
    if (part === 0) {
      this.timeA = time;
      model += this.getDateStr(this.dateA) + " " + this.getTimeStr(time)
    } else {
      this.timeB = time;
      model += this.getDateStr(this.dateA) + " " + this.getTimeStr(time)
    };
    this._emitCalendar()
  }

  /**是否确认更改选中 */
  onSureChange(flag: boolean) {
    this.emitSureCheck.emit(flag)
  }

  private _emitCalendar() {
    let startDate = this.dateA, startTime = this.timeA, endDate = this.dateB || this.ifMulti && startDate, endTime = this.timeB;
    let start = startDate && (startDate.date + (this.timePicker && this.secondPicker ? ' ' + startTime.hour + ":" + startTime.miute + ':' + startTime.second : this.timePicker ? ' ' + startTime.hour + ":" + startTime.miute : '')) || "";
    let end = endDate && (endDate.date + (this.timePicker && this.secondPicker ? ' ' + endTime.hour + ":" + endTime.miute + ':' + endTime.second : this.timePicker ? ' ' + endTime.hour + ":" + endTime.miute : '')) || "";
    let time = start + (this.ifMulti && endDate ? " ~ " + end : '');
    this.emitDate = { startDate, startTime, endDate, endTime, start, end, time };
    if (this.model !== time) {
      this.onCalendarChange.emit(this.emitDate)
    }
  }

  /**生成日期字符串*/
  private getDateStr(date: CalendarItem): string {
    return date ? `${date.year}-${date.month}-${date.day}` : "";
  }

  /**生成时间 */
  private getTimeStr(time: CalendarTime): string {
    let res = "";
    if (this.timePicker) {
      res += `${time.hour}:${time.miute}`
      if (this.secondPicker) {
        res += `:${time.second}`
      }
    }
    return res
  }

  /**面板月份控制按钮 
   * @date 显示的日历对象
   * @part=0 面板1  part=1 面板2
   * @num=-1 月份减 num=1 月份加
   * */
  private setShowMonthCtr(part: number, num: number) {
    let showA = this.showA, showB = this.showB, year, month;
    if (!this.ifLink) {
      /**非联动变更需要各面板分别变动 */
      if (part == 0) {
        ({ year, month } = this.getMonthAndYear(showA, num))
        if (year > showB.year || (year == showB.year && month >= showB.month)) return;
        this.showA = new CalendarItem(year, month);
      } else {
        ({ year, month } = this.getMonthAndYear(showB, num))
        if (year < showA.year || (year == showA.year && month <= showA.month)) return;
        this.showB = new CalendarItem(year, month);
      }
    } else {
      if (part == 0 && num == 1 || part == 1 && num == -1) {
        /**联动时面板1不能向后跳月 面板2不能先前跳月 即双面板联动变更需要判断另一面板是否有此日期 */
        return;
      }
      ({ year, month } = this.getMonthAndYear(showA, num));
      this.showA = new CalendarItem(year, month);
      ({ year, month } = this.getMonthAndYear(showB, num));
      this.showB = new CalendarItem(year, month);
    }
  }

  private getMonthAndYear(date: CalendarItem, num: number): { year: number, month: number, } {
    let year, month;
    month = date.month + num, year = date.year;
    year = month == 0 ? year - 1 : month == 13 ? year + 1 : year;
    month = month == 0 ? 12 : month == 13 ? 1 : month;
    return { year, month }
  }

  /**根据日期数据获得日期对象*/
  private getDate(date: string | Date = new Date()): CalendarItem {
    /**无效日期判断 */
    let d = UtilDate.ifValid(date) ? new Date(date) : new Date();
    let res = new CalendarItem(d.getFullYear(), d.getMonth() + 1, d.getDate(), new Date());
    return res
  }

  /**设置配置 */
  private setPara() {
    let para: ShareParaCalendar = Object.assign({}, this.defaultPara, this.inPara);
    this.ifSingle = this.ifSingle ?? para.ifSingle;
    this.ifDefualt = this.ifDefualt ?? para.ifDefualt;
    this.ifLink = this.ifLink ?? para.ifLink;
    this.ifMulti = this.ifMulti ?? para.ifMulti;
    this.intervalMinute = this.intervalMinute ?? para.intervalMinute;
    this.intervalSecond = this.intervalSecond ?? para.intervalSecond;
    this.timePicker = this.timePicker ?? para.showTimePicker;
    this.secondPicker = this.secondPicker ?? para.showSecondPicker;
    this.weekNumbers = this.weekNumbers ?? para.showWeekNumbers;
  }
}
