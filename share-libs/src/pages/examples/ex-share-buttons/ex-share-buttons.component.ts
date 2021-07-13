import { Component, OnInit } from '@angular/core';
import { Icon } from 'leaflet';
import { ShareBtn } from 'share-libs/src/components/button/share-buttom';
import { BtnType, IconClass } from 'share-libs/src/enum';
import { ColorEnum } from 'share-libs/src/enum/color.enum';

@Component({
  selector: 'ex-share-buttons',
  templateUrl: './ex-share-buttons.component.html',
  styleUrls: ['./ex-share-buttons.component.less']
})
export class ExShareButtonsComponent implements OnInit {
  constructor() { }

  btnParaA: ShareBtn = {
    iconPer: IconClass.pullDown,
    iconSuf: IconClass.pullDown,
    width: 130,
    color: ColorEnum.yellow,
    colorBG: ColorEnum.red,
    clickPer: () => { console.log('clickPer') }
  }

  btnParaB: ShareBtn = new ShareBtn();
  ngOnInit() {
    setTimeout(() => {


      this.btnParaA.width = 100;
      this.btnParaA = Object.assign({}, this.btnParaA)
    }, 3000);
  }

}
