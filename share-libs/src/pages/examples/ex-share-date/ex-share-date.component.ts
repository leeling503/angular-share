import { Component, OnInit } from '@angular/core';
/**日期控件示例 day  month  year*/
@Component({
  selector: 'ex-share-date',
  templateUrl: './ex-share-date.component.html',
  styleUrls: ['./ex-share-date.component.less']
})
export class ExShareDateComponent implements OnInit {

  constructor() { }
  calendarModel = [];
  month = "07";
  monthB = "";
  day
  dayA;
  dayB;
  year = "2020";
  inOptions = {
    autoApply: false,
  }

  localA = { format: 'YYYY-MM-DD HH:mm' }
  ngOnInit() { }
  onModelMonthChange($event) {
    // this.month = $event
  }
  onModelMonthChangeB($event) {
    this.monthB = $event
  }

  onCalendarChange($event) {
    console.log($event)
  }
}
