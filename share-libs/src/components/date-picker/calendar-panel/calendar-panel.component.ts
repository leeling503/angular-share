import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Util, UtilDate } from 'share-libs/src/utils';
import { CalendarItem, CalendarTime, CheckDateChangeItem, ShareParaCalendar } from '../share-date-picker.model';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-panel',
  templateUrl: './calendar-panel.component.html',
  styleUrls: ['./calendar-panel.component.less']
})
export class ShareCalendarPanelComponent implements OnInit {

  constructor() { }
  /**星期栏数据 */
  public WEEK: string[] = ['一', '二', '三', '四', '五', '六', '日'];
  /**选中激活的日期 */
  @Input() public checkA: CalendarItem;
  /**第二个选中激活的日期 */
  @Input() public checkB: CalendarItem;
  /**悬停的日期 */
  @Input() public hoverDate: CalendarItem;
  /**显示的日历面板 */
  @Input() show: CalendarItem;
  /**当前日历显示月份需要发生改变 */
  @Output('onShowChange') public emitShow: EventEmitter<CalendarItem> = new EventEmitter();
  /**选中数据发生改变 */
  @Output("onCheckDateChange") public emitCheckDate: EventEmitter<CheckDateChangeItem> = new EventEmitter();
  /**悬浮日期发生改变 */
  @Output("onHoverDateChange") public emitHoverDate: EventEmitter<CalendarItem> = new EventEmitter();
  /**时分秒发生改变 */
  @Output('onTimeChange') public emitTimeChange: EventEmitter<CalendarTime> = new EventEmitter()
  /**日期多面板标识 0 面板A ， 1面板B */
  @Input() part: number = 0;
  /**是否是单面板 */
  @Input() single: boolean = true;
  /**多个日期范围选择 */
  @Input() multi: boolean = false;
  /**范围最大限制 */
  @Input() maxRange: number = 7;
  /**是否联动 */
  @Input() link: boolean;
  /**间隔 */
  @Input() intervalMinute: number = 1;
  /**间隔 */
  @Input() intervalSecond: number = 1;
  /**时分选择器 */
  @Input() timePicker: boolean = false;
  /**秒选择器 */
  @Input() secondPicker: boolean = false;
  /**显示第几周 */
  @Input() weekNumbers: boolean = false;
  /**时分秒选择结果 */
  @Input() time: CalendarTime = {};
  /**时分秒的选项 */
  public hOptions: string[];
  public mOptions: string[];
  public sOptions: string[];
  /**生成的日历面板 */
  public calendar: CalendarItem[] = [];

  get perDisable() {
    return !this.single && this.link && this.part === 1
  }

  get nextDisable() {
    return !this.single && this.link && this.part === 0
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.show && this.show) {
      /**面板显示日期月份 */
      this.show = this.getDate(this.show.date);
      this.generCalendar();
    }
    if (changes.hoverDate || changes.checkB || changes.checkA) {
      /**悬浮，选中等状态改变 */
      this.setCalendarState();
    }
    if (changes.intervalMinute && this.intervalMinute > 0) {
      this.mOptions = Util.genIntervalNums(this.intervalMinute, 59);
    }
    if (changes.intervalSecond && this.intervalSecond > 0) {
      this.sOptions = Util.genIntervalNums(this.intervalMinute, 59);
    }
  }

  ngOnInit() {
    if (!this.show) {
      /**不存在show对象则需要初始化生成 */
      this.show = this.getDate()
      this.generCalendar();
    }
    this.hOptions = Util.genIntervalNums(1, 23);
    this.mOptions = this.mOptions || Util.genIntervalNums(this.intervalMinute, 59);
    this.sOptions = this.sOptions || Util.genIntervalNums(this.intervalSecond, 59);
  }

  /**时分秒改变 */
  onChangeTime() {
    this.emitTimeChange.emit(this.time)
  }

  /**页面点击日期 */
  onClickDate(item: CalendarItem) {
    if (item._disable) return;
    /**未度过的日期不允许查看点击 */
    if (!item._showMonth) {
      /**非当前页面展示月需要更新日历 */
      this.onMonthCtr(item._monthInc)
    }
    /**用户激活日期变更为点击日期 */
    this.setCheckDate(item);
    this.setCalendarState()
    this.emitModel()
  }

  /**面板月份控制按钮 
 * @date 显示的日历对象
 * @part=0 面板1  part=1 面板2
 * @num=-1 月份减 num=1 月份加
 * */
  onMonthCtr(num: number) {
    if (!this.single) {
      //双面板日历组件需交由父组件进行显示日期变更，触发变更ngOnChange中show对象的变更事件
      this.show._monthInc = num;
      this.emitShow.emit(this.show);
    } else {
      let { year, month } = this.getMonthAndYear(this.show, num);
      this.show = new CalendarItem(year, month);
      this.generCalendar();
    }
  }

  /**鼠标进入当前日期 */
  onEnterDate(item: CalendarItem) {
    let checkA = this.checkA;
    if ((!checkA) || (item.time < checkA.time) || (this.multi && !checkA || this.checkB)) {
      this.hoverDate = undefined;
      this.setCalendarState();
      return;
    }
    this.hoverDate = item;
    this.setCalendarState();
    this.emitHoverDate.emit(this.hoverDate)
  }

  /**鼠标离开日历 */
  onLeaveCalendar() {
    this.hoverDate = undefined;
    this.emitHoverDate.emit(this.hoverDate)
  }

  private setCheckDate(item: CalendarItem) {
    if (this.multi) {
      if (this.checkB) {
        this.checkA = item;
        this.checkB = undefined;
        this.hoverDate = undefined;
      } else if (this.checkA && item.time >= this.checkA.time) {
        this.checkB = item;
      } else {
        this.checkA = item;
        this.hoverDate = undefined;
      }
    } else {
      this.checkA = item;
    }
  }

  private emitModel() {
    this.emitCheckDate.emit({ A: this.checkA, B: this.checkB });
  }

  /**根据date生成日历面板(需要自己赋值给日历变量)并给日历单位设置状态 */
  private generCalendar(): void {
    let date = this.show, curYear = date.year, curMonth = date.month;
    /**最后一天的数字 */
    let lastDays = UtilDate.getMonthLastDay(curYear, curMonth);
    /**得到月份的第一天日期字符串 */
    let fymd = `${curYear}-${curMonth}-01`;
    /**得到月份的最后天日期字符串 */
    let lymd = `${curYear}-${curMonth}-${lastDays}`;
    /**始末日期对象*/
    let fDate = new Date(fymd), lDate = new Date(lymd);
    /**始末日期对象对应的星期数*/
    let fDay = fDate.getDay(), lDay = lDate.getDay();
    /**上下个月补齐星期,需要补几个数  如果是补齐42天则可以不用next来计算末尾补数*/
    let per = [6, 7, 1, 2, 3, 4, 5][fDay], next = [7, 6, 5, 4, 3, 2, 1][lDay];
    /**上个月的年月和下个月的年月 */
    let perY, perM, perLastDays, nextY, nextM;
    if (per) {
      perM = curMonth - 1 > 0 ? curMonth - 1 : 12;
      perY = perM == 12 ? curYear - 1 : curYear;
      perLastDays = UtilDate.getMonthLastDay(perY, perM);
    }
    if (next) {
      nextM = curMonth + 1 > 12 ? 1 : curMonth + 1;
      nextY = nextM == 1 ? curYear + 1 : curYear;
    }
    let calendar: CalendarItem[] = [], curDate = new Date(), d = 0;
    for (let i = per; i > 0; i--, d++) {
      let data = new CalendarItem(perY, perM, (perLastDays + 1) - i, curDate);
      data._monthInc = -1;
      calendar.push(data)
    }
    for (let i = 1; i <= lastDays; i++, d++) {
      new Date(`${curYear}-${curMonth}-${i}`)
      let data = new CalendarItem(curYear, curMonth, i, curDate);
      data._showMonth = true;
      calendar.push(data)
    }
    for (let i = 1; d < 42; i++, d++) {
      let data = new CalendarItem(nextY, nextM, i, curDate)
      data._monthInc = 1;
      calendar.push(data)
    }
    this.calendar = calendar;
    this.setCalendarState();
  }

  /**根据日期数据获得日期对象*/
  private getDate(date: string | Date = new Date()): CalendarItem {
    /**无效日期判断 */
    let d = UtilDate.ifValid(date) ? new Date(date) : new Date();
    let res = new CalendarItem(d.getFullYear(), d.getMonth() + 1, d.getDate(), new Date());
    return res
  }

  /**月份变更后获取正确的年月 */
  private getMonthAndYear(date: CalendarItem, num: number): { year: number, month: number, } {
    let year, month;
    month = date.month + num, year = date.year;
    year = month == 0 ? year - 1 : month == 13 ? year + 1 : year;
    month = month == 0 ? 12 : month == 13 ? 1 : month;
    return { year, month }
  }

  /**设置日历项相关状态 */
  private setCalendarState() {
    let checkA = this.checkA, checkB = this.checkB;
    this.calendar.forEach(e => {
      e._checkA = checkA && checkA.date == e.date && e._showMonth;
      e._checkB = this.multi && checkB && checkB.date == e.date && e._showMonth;
      e._range = this.getStateRange(e);
      e._disable = this.getStateDisable(e);
    })
  }

  /**设置滑选状态 */
  private getStateRange(item: CalendarItem): boolean {
    let date = this.hoverDate || this.checkB, checkA = this.checkA;
    /**范围选择且时面板显示当月 */
    let flag = this.multi && item._showMonth;
    /**指针悬浮日期或者范围日期存在 */
    flag = flag && (date && date.time >= item.time && item.time >= checkA.time);
    return flag
  }

  /**设置禁用状态 */
  private getStateDisable(item: CalendarItem): boolean {
    let checkA = this.checkA, checkB = this.checkB, maxRange = this.maxRange, time = 24 * 3600000
    /** 最大范围存在并且是多选 */
    let flag = this.multi && maxRange && maxRange > 0;
    /** 选择了第一个且第二个日期未选时 */
    flag = flag && !!checkA && !checkB;
    /** 时间差值大于设置范围  (+8*3600000是因为夏令时和冬令时 每年十月10日-9日有32小时)*/
    flag = flag && item.time - checkA.time > (maxRange * time + 8 * 3600000);
    return flag;
  }

}