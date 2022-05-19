import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { OPTIONS_DATA_BASE } from 'share-libs/services/global/gl-options.service';
import { Util, UtilArray, UtilChangesValue, UtilDate, UtilStr } from 'share-libs/utils';
import { MadeOverlay, MadePerfixOverlay } from '../../base';
import { Calendar, ShareParaCalendar } from '../share-date-picker.model';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class ShareCalendarComponent extends MadePerfixOverlay implements OnInit {
  constructor(private el: ElementRef) {
    super();
    this.nativeEl = this.el.nativeElement;
  }
  private defaultPara: ShareParaCalendar = {
    ifSingle: true,
    ifDefualt: false,
    ifLink: true,
    ifMulti: false,
    showTimePicker: false,
    showSecondPicker: false,
    showWeekNumbers: true,
    maxRange: 7,
    intervalMinute: 5,
    intervalSecond: 5,
    autoApply: true,
  }
  /**单日期选框*/
  @Input() public inIfSingle: boolean;
  /**默认选择当天*/
  @Input() public inIfDefualt: boolean;
  /**双日历级联*/
  @Input() public inIfLink: boolean;
  /**多日期范围选择*/
  @Input() public inIfMulti: boolean;
  /**小时和分钟选择*/
  @Input() public inTimePicker: boolean;
  /**秒选择器*/
  @Input() public inSecondPicker: boolean;
  /**日历面板显示本年第几周*/
  @Input() public inWeekNumbers: boolean;
  /**分钟间隔*/
  @Input() public inIntervalMinute: number;
  /**秒钟间隔*/
  @Input() public inIntervalSecond: number;
  /**无需点击确定按钮更新 */
  @Input() public inAutoApply: boolean;
  /**初始时间 */
  @Input() model: string | string[];
  /**默认提示语 */
  @Input() inPlaceholder: string = "请选择";
  /**此属性配置禁止异步传入,只会修改一次 */
  @Input() inPara: ShareParaCalendar;
  @Output() modelChange: EventEmitter<string | string[]> = new EventEmitter();
  /**强制设置 */
  @Input() inOutType: 'string' | 'array';
  /**根据model类型计算得来 */
  private inputType: 'string' | 'array';
  /**日历数据缓存（可能取消也可能确定） */
  private cacheCalendarDate: Calendar;
  /**已确定的日历数据 */
  private calendarDate: Calendar;
  /**点击清空后重新初始化已确定的日历数据 */
  private ifClearInit: boolean = false;
  /**默认配置已加载 */
  private flagInitPara: boolean = false;
  /** */
  /**初始传入的model解析 */
  modelA: string;
  /**初始传入的model解析 */
  modelB: string;
  emitModel: string | string[];
  vModel: string;
  ngOnChanges(changes: SimpleChanges): void {
    super.ngPerfixChange(changes);
    if (changes.inPara) {
      this.setPara()
    }
    if (changes.inIfDefualt) {
      this.setVModelInit();
    }
    /**异步更改 */
    if (UtilChangesValue(changes, 'model') && !Util.ifEqual(this.model, this.emitModel)) {
      this.setModelByUser()
      this.setVModelInit()
    }
    if (changes.inAutoApply || changes.inTimePicker) {
      this.inAutoApply = this.inAutoApply && !this.inTimePicker
    }
  }

  ngOnInit(): void {
    this.setPara();
  }

  /**日历发生更改 */
  onCalendarChange(calendar: Calendar) {
    this.cacheCalendarDate = calendar;
    this.setVModelByCalendar(calendar);
    this.closeOverlay(calendar);
  }

  /**确定选择 */
  onSureCheck($event?: boolean) {
    this.overlayOpen = !1;
    if ($event || (this.ifClearInit && this.inIfDefualt)) {
      this.ifClearInit = false;
      this.calendarDate = this.cacheCalendarDate;
    }
    this.setVModelByCalendar();
    this._emitModel()
  }

  /**清空操作 */
  onClearClick() {
    this.ifClearInit = true;
    this.calendarDate = new Calendar();
    this.setVModelByCalendar();
    this._emitModel();
  }

  /**根据传入model设置vModel数据 */
  private setModelByUser(): void {
    let dateA, dateB, model = this.model;
    if (UtilArray.isArray(model)) {
      this.inputType = "array";
      dateA = model[0], dateB = model[1];
    } else {
      this.inputType = "string";
      model = UtilStr.split(model, '~');
      dateA = model[0], dateB = dateB = model[1];
    }
    this.modelA = dateA; this.modelB = dateB;
  }

  /**初始化设置输入框可视字符串model */
  private setVModelInit() {
    let dateA = this.modelA, dateB = this.modelB, vModel: string;
    this.calendarDate = {};
    if (dateA || dateB) {
      vModel = dateA;
      if (dateB) {
        vModel += ` ~ ${dateB}`
      }
    } else if (this.inIfDefualt) {
      let timeA: Date = new Date();
      let timeB: Date = new Date();
      let time = this.inTimePicker && this.inSecondPicker ? 'hh:mm:ss' : this.inTimePicker ? 'hh:mm' : undefined;
      vModel = dateA = UtilDate.getStr(timeA, undefined, time);
      if (this.inIfMulti) {
        vModel += ` ~ `;
        dateB = UtilDate.getStr(timeB, undefined, time);
        vModel += dateB;
      }
    }
    this.calendarDate = { start: dateA, end: dateB, time: vModel };
    this.vModel = vModel;
  }

  /**根据传入的日历对象或全局日历对象设置输入框可视Input的数据 */
  private setVModelByCalendar(calendar: Calendar = this.calendarDate) {
    let { time } = calendar;
    Promise.resolve().then(() => { this.vModel = time; })
  }

  /**试图关闭弹出层并弹出选中 flag:强制关闭并弹出 */
  private closeOverlay(calendar: Calendar) {
    if (this.inAutoApply) {
      this.overlayOpen = !1;
      this.calendarDate = calendar;
      this._emitModel()
    }
  }

  private _emitModel(flag: boolean = false) {
    let outType = this.inOutType ?? this.inputType;
    let { start, end, time } = this.calendarDate;
    if (outType == "string") {
      this.emitModel = time;
    } else if (outType == "array") {
      this.emitModel = [start];
      if (this.inIfMulti) {
        this.emitModel.push(end)
      }
    }
    if (Util.ifEqual(this.emitModel, this.model) && !flag) return;
    this.modelChange.emit(this.emitModel);
  }

  /**设置整体配置 */
  private setPara() {
    if (this.flagInitPara) return;
    this.flagInitPara = true;
    let para: ShareParaCalendar = Object.assign({}, this.defaultPara, this.inPara);
    this.inIfSingle = this.inIfSingle ?? para.ifSingle;
    this.inIfDefualt = this.inIfDefualt ?? para.ifDefualt;
    this.inIfLink = this.inIfLink ?? para.ifLink;
    this.inIfMulti = this.inIfMulti ?? para.ifMulti;
    this.inIntervalMinute = this.inIntervalMinute ?? para.intervalMinute;
    this.inIntervalSecond = this.inIntervalSecond ?? para.intervalSecond;
    this.inTimePicker = this.inTimePicker ?? para.showTimePicker;
    this.inSecondPicker = this.inSecondPicker ?? para.showSecondPicker;
    this.inWeekNumbers = this.inWeekNumbers ?? para.showWeekNumbers;
    this.inAutoApply = (this.inAutoApply ?? para.autoApply) && !this.inTimePicker;
  }
}
