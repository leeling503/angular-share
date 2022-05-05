import { UtilDate } from "share-libs/src/utils";

export type TimeRange = { start?: string, end?: string }
export interface DateMonth {
  id: number;
  value: string;
  name: string;
}

/**日期数据（对应每天的各种数据） */
export class DateData {
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
  /** time */
  time: number;
  /** 未来日子 */
  _future?: boolean;
  /** 当月 */
  _curMonth?: boolean;
  /** 当天 */
  _curDay?: boolean;
  /** 激活的月份 */
  _activeMonth?: boolean;
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
    this._future = cy < y ? true : cy > y ? false : cm < m ? true : cm > m ? false : cd < d ? true : false;
    this._curMonth = y == cy && cm == m;
    this._curDay = this._curMonth && cd == d;
  }

}

export class ShareParaCalendar {
  /**单日期选框 */
  single?: boolean = true;
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