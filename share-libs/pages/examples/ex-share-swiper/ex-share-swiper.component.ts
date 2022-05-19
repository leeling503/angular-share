import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'share-libs/modules/swiper/share-swiper.model';

@Component({
  selector: 'app-ex-share-swiper',
  templateUrl: './ex-share-swiper.component.html',
  styleUrls: ['./ex-share-swiper.component.less']
})
export class ExShareSwiperComponent implements OnInit {
  inOptions: SwiperOptions = [
    { imgUrl: 'assets/images/login/login_bg.png' },
    { imgUrl: 'assets/images/login/phon_sup.png' },
    { imgUrl: 'assets/images/login/pwd_icon.png' },
    { imgUrl: 'assets/images/login/qr_code_sup.png' },
    { imgUrl: 'assets/images/login/qr_code.png' },
  ]
  constructor() { }

  ngOnInit() {
  }

}
