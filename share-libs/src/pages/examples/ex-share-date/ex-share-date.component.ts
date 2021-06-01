import { Component, OnInit } from '@angular/core';
/**日期控件示例 day  month  year*/
@Component({
  selector: 'ex-share-date',
  templateUrl: './ex-share-date.component.html',
  styleUrls: ['./ex-share-date.component.less']
})
export class ExShareDateComponent implements OnInit {

  constructor() { }
  month = "2020-07";
  day
  year = "2020";
  inOptions = {
    autoApply:false,
  }
  ngOnInit() { }
  onModelMonthChange($event) {
    this.month = $event
  }
}
