import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UtilArray, UtilStr } from 'share-libs/src/utils';
import { DateData, ShareParaCalendar } from '../share-date-picker.model';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-base',
  templateUrl: './calendar-base.component.html',
  styleUrls: ['./calendar-base.component.less']
})
export class ShareCalendarBaseComponent implements OnInit {

  constructor() {
    this.showDateA = this.getDate()
  }
  /**接受年月日 （2021-01-01） */
  @Input() inDate: string = "2021-10-05";
  @Input() inPara: ShareParaCalendar;
  @Input() model: string | string[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter()
  /**组件日期对象 */
  @Input() date: DateData;
  @Input() inSingle: boolean;
  private defaultPara: ShareParaCalendar = {
    single: false,
  }
  ifSingle: boolean;
  /**选中的第一个日期 */
  public dateA: DateData;
  /**选中的第二个日期 */
  public dateB: DateData;
  /**显示的第一个日历 */
  public showDateA: DateData;
  /**显示的第二个日历 */
  public showDateB: DateData;
  public hoverDate: DateData;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.model) {
      this.setDateByModel()
    }
  }

  ngOnInit() {
    this.setPara()
  }

  private setPara() {
    let para: ShareParaCalendar = Object.assign({}, this.defaultPara, this.inPara);
    this.ifSingle = this.inSingle ?? para.single;

  }

  /**根据传入设置日历 */
  setDateByModel() {
    let dateA, dateB, showA: DateData, showB: DateData, model = this.model;
    if (UtilArray.isArray(model)) {
      dateA = model[0], dateB = model[1];
    } else {
      model = UtilStr.split(model, '~');
      dateA = model[0], dateB = dateB = model[1];
    }
    showA = this.getDate(dateA);
    showB = this.getDate(dateB);
    /**需要考虑年份故用此判断 */
    if (!(showB.month > showA.month && showB.time > showA.time)) {
      showB = new DateData(showA.year, showA.month + 1)
    }
    this.showDateA = showA;
    this.showDateB = showB;
  }

  onDataCtr(date: DateData, para: number, num: number) {
    console.log(date, para, num)
  }

  onChangeDateA(date: DateData) {
    this.dateA = date
  }
  onChangeDateB(date: DateData) {
    this.dateB = date
  }
  onChangeHoverDate(date: DateData) {
    this.hoverDate = date
  }

  /**根据日期数据获得日期对象*/
  private getDate(date: string | Date = new Date()): DateData {
    /**无效日期判断 */
    let d = !!new Date(date).getTime ? new Date(date) : new Date();
    let res = new DateData(d.getFullYear(), d.getMonth() + 1, d.getDate(), new Date());
    return res
  }
}
