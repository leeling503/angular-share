import { Component, OnInit, PlatformRef } from '@angular/core';
import { Icon } from 'leaflet';
import { ShareParaBtn } from 'share-libs/modules/button/share-button.model';
import { TypeBtn, IconClass } from 'share-libs/enum';
import { ColorEnum } from 'share-libs/enum/color.enum';

@Component({
  selector: 'ex-share-buttons',
  templateUrl: './ex-share-buttons.component.html',
  styleUrls: ['./ex-share-buttons.component.less']
})
export class ExShareButtonsComponent implements OnInit {
  constructor(private pl_: PlatformRef) { }

  btnParaA: ShareParaBtn = {
    iconPer: IconClass.clearRed,
    iconSuf: IconClass.pullDown,
    width: 130,
    color: ColorEnum.yellow,
    colorBG: ColorEnum.red,
    ifDisable: true,
    clickPer: () => { console.log('clickPer') },
    click: () => { console.log('click') },
    clickSuf: () => { console.log('clickSuf') },
  }

  btnParaB: ShareParaBtn = new ShareParaBtn();
  ngOnInit() {
    setTimeout(() => {
      this.btnParaA.width = 100;
      this.btnParaA = Object.assign({}, this.btnParaA)
    }, 3000);
  }

}
