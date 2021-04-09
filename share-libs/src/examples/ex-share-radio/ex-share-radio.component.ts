import { Component, OnInit } from '@angular/core';
import { RadiosData, RadiosPara } from 'share-libs/src/components/radio/share-radio.model';

@Component({
  selector: 'ex-share-radio',
  templateUrl: './ex-share-radio.component.html',
  styleUrls: ['./ex-share-radio.component.less']
})
export class ExShareRadioComponent implements OnInit {
  radioDatas: RadiosData[];
  radioPara: RadiosPara;
  modelRadio =''
  constructor() { }

  ngOnInit() {
    this.radioPara = {
      /**可否多选 */
      multi: false,
      /**图标类型 */
      iconType: 'radio',
      /**能否取消所有选择 */
      clear: false,
    }
    setTimeout(() => {
      this.radioDatas = [
        { key: '1', value: 10, ifCheck: false, ifDis: false },
        { key: '2', value: 0, ifCheck: false, ifDis: true },
        { key: '3', value: 20, ifCheck: false, ifDis: false },
        { key: '4', value: 'false', ifCheck: false, ifDis: false },
        { key: '5', value: undefined, ifCheck: false, ifDis: false },
      ]
    }, 100);
  }

  onModelChange($event) {
    console.log(this.modelRadio, $event)
  }

}
