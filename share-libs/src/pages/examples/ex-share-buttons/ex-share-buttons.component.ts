import { Component, OnInit } from '@angular/core';
import { ShareBtn } from 'share-libs/src/components/button/share-buttom';
import { BtnType, IconClass } from 'share-libs/src/enum';

@Component({
  selector: 'ex-share-buttons',
  templateUrl: './ex-share-buttons.component.html',
  styleUrls: ['./ex-share-buttons.component.less']
})
export class ExShareButtonsComponent implements OnInit {
  constructor() { }
  btnParaA: ShareBtn = {
    iconPer: IconClass.pullDown
  }
  btnParaB: ShareBtn = {
    iconPer: IconClass.pullDown,
    disable: true,
    type: BtnType.danger,

  }
  ngOnInit() {
  }

}
