import { UtilDate } from "share-libs/utils";

export type TimeRange = { start?: string, end?: string };

export interface DateMonth {
  id: number;
  value: string;
  name: string;
}

/**月历表*/
export const MONTHS: DateMonth[] = [
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

export class MonthItem {
  year: number | string = "";
  month: number | string = "";
  time?: string
}

/**日历对象数据（对应每天的各种数据） */
export class CalendarItem {
  /** 日期字符串*/
  date: string;
  /** 对应的星期几 */
  week: number;
  /** 年 */
  year: number;
  /** 月份 (不需要+1处理)  */
  month: number;
  /** 对应的第几天 */
  day: number;
  /** 本年度第几周*/
  weeks?: number;
  /** time */
  time: number;
  /** 未来日子 */
  _future?: boolean;
  /** 当月 */
  _curMonth?: boolean;
  /** 当天 */
  _curDay?: boolean;
  /** 日历展示的月份 */
  _showMonth?: boolean;
  /**与展示月份的差值 -1 | 1 */
  _monthInc?: number;
  /** 处于选中范围状态 */
  _range?: boolean;
  /** 处于选中范围状态 */
  _checkA?: boolean;
  /** 处于选中范围状态 */
  _checkB?: boolean;
  /**禁选状态 */
  _disable?: boolean;
  /**
   * @param y年份
   * @param m月份 12月对应12
   * @param d日期
   * @param cur当日时间
  */
  constructor(y: number, m: number, d: number = 1, cur: Date = new Date()) {
    let date = new Date(`${y}-${m}-${d}`);
    let cd = cur.getDate(), cm = cur.getMonth() + 1, cy = cur.getFullYear();
    let dateStr = UtilDate.getStr(date);
    this.date = dateStr;
    this.year = y;
    this.month = m;
    this.day = d;
    this.time = date.getTime();
    this.week = date.getDay();
    this.weeks = UtilDate.getFullWeek(date);
    this._future = cy < y ? true : cy > y ? false : cm < m ? true : cm > m ? false : cd < d ? true : false;
    this._curMonth = y == cy && cm == m;
    this._curDay = this._curMonth && cd == d;
  }

}

export class ShareParaCalendar {
  /**单日期选框 */
  ifSingle?: boolean = true;
  /**默认选择当天 */
  ifDefualt?: boolean = true;
  /**双日历级联 */
  ifLink?: boolean = true;
  /**多日期范围选择 */
  ifMulti?: boolean = false
  /**日期最大范围跨度 */
  maxRange?: number;
  /**日历面板显示本年第几周 */
  showWeekNumbers?: boolean;
  /**小时和分钟选择 */
  showTimePicker?: boolean;
  /**秒选择器(需要同时显示小时和分钟选择器) */
  showSecondPicker?: boolean;
  /**分钟间隔 */
  intervalMinute?: number;
  /**秒钟间隔 */
  intervalSecond?: number;
  /**自动更新(小时和分钟选择也必须为false，否则不会自动更新) */
  autoApply?: boolean;
}

export class CalendarTime {
  hour?: string | number;
  miute?: string | number;
  second?: string | number;
}

export class CheckDateChangeItem {
  A: CalendarItem;
  B: CalendarItem;
}

/**日历数据 */
export class Calendar {
  start?: string = "";
  startDate?: CalendarItem;
  startTime?: CalendarTime;
  end?: string = "";
  endDate?: CalendarItem;
  endTime?: CalendarTime;
  time?: string = "";
}

var defaultOptions = {
  parentEl: 'body',//挂载节点
  showWeekNumbers: false,//true将会在选择面板显示本年第几周
  showISOWeekNumbers: false,//在日历的每周开始时显示ISO周数与 showWeekNumbers 极为类似
  showDropdowns: false,//是否显示年份和月份的下拉选择框
  minYear: 1900,//下拉选择框最小年份
  maxYear: 2100,//下拉选择框最大年份
  singleDatePicker: false,//单日期选择器
  timePicker: false,//小时和分钟选择器，需在local中设置format
  timePicker24Hour: true,//24小时制
  timePickerIncrement: 5,//分钟间隔
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