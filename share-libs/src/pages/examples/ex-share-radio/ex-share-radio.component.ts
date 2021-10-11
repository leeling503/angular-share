import { Component, OnInit } from '@angular/core';
import { RadioData, RadioPara } from 'share-libs/src/components/radio/share-radio.model';

@Component({
  selector: 'ex-share-radio',
  templateUrl: './ex-share-radio.component.html',
  styleUrls: ['./ex-share-radio.component.less']
})
export class ExShareRadioComponent implements OnInit {
  constructor() { }
  radioData: RadioData[] = [{ key: true, value: '是' }, { key: false, value: '否' }]
  radioKey: RadioData[] = [{ key: 'key', value: 'key' }, { key: 'value', value: 'value' }]
  radioType: RadioData[] = [
    { key: 'radio', value: 'radio' },
    { key: 'check', value: 'check' },
    { key: 'cricle', value: 'cricle' }]
  paraA: RadioPara = {
    ifMulti: false,
    ifClear: false,
    ifDisCancel: false,
    iconType: 'check',
    key: 'value'
  }
  radioDatasA: RadioData[];
  modelRadioA = 20;


  ngOnInit() {
    this.radioDatasA = [
      { key: '1', value: 10 },
      { key: '2', value: 0 },
      { key: '3', value: 20 },
      { key: '4', value: 'false' },
      { key: '5', value: undefined },
      { key: '6', value: true },
      { key: '7', value: '7' },
      { key: '8', value: '8', _dis: true, _check: true },
      { key: '9', value: '9' },
    ]
  }

  onModelChangeA($event) { console.log(this.modelRadioA, $event) }

}
