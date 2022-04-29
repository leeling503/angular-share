import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
/**
 * 日历组件
 */
@Component({
  selector: 'share-calendar-base',
  templateUrl: './calendar-base.component.html',
  styleUrls: ['./calendar-base.component.less']
})
export class ShareCalendarBaseComponent implements OnInit {

  constructor(private el: ElementRef) { }
  /**接受年月日 （2021-01-01） */
  @Input() inDate: string = "2021-10-05";
  @Input() inPara: ShareParaCalendar;
  @Input() model: string | string[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter()

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() { }

}

export class ShareParaCalendar { }