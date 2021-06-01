import { Component, OnInit } from '@angular/core';
import { ID } from 'share-libs/src/const/ids';

@Component({
  selector: 'ex-share-flv',
  templateUrl: './ex-share-flv.component.html',
  styleUrls: ['./ex-share-flv.component.less']
})
export class ExShareFlvComponent implements OnInit {
  flvUrl:string = "http://183.63.55.74:10000/sms/34020000002020000001/flv/hls/86507743286507743221_34020000001320000021.flv"
  constructor() { }

  ngOnInit() {}

}
