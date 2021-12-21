import { Component, OnInit } from '@angular/core';
import { RadioOption, RadioPara } from 'share-libs/src/components/radio/share-radio.model';

@Component({
  selector: 'ex-share-radio',
  templateUrl: './ex-share-radio.component.html',
  styleUrls: ['./ex-share-radio.component.less']
})
export class ExShareRadioComponent implements OnInit {
  constructor() { }
  radioData: RadioOption[] = [{ key: true, value: '是' }, { key: false, value: '否' }]
  radioKey: RadioOption[] = [{ key: 'key', value: 'key' }, { key: 'value', value: 'value' }]
  radioType: RadioOption[] = [
    { key: 'radio', value: 'radio' },
    { key: 'check', value: 'check' },
    { key: 'cricle', value: 'cricle' }]
  model: boolean = true;
  paraA: RadioPara = {
    ifMulti: false,
    ifClear: false,
    ifDisCancel: false,
    iconType: 'check',
    key: 'value'
  }
  paraB: RadioPara = {
    ifMulti: false,
    ifClear: true,
    ifDisCancel: true,
    iconType: 'radio',
    key: 'value'
  }
  radioDatasB: RadioOption[];
  radioDatasA: RadioOption[];
  modelRadioA;
  modelRadioB = [20, '8'];
  modelRadioC;
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
    this.radioDatasB = [
      { key: '1', value: 10 },
      { key: '2', value: 0 },
      { key: '3', value: 20 },
      { key: '4', value: 'false' },
      { key: '5', value: undefined },
      { key: '6', value: true },
      { key: '7', value: '7' },
      { key: '8', value: '8' },
      { key: '9', value: '9' },
    ]
  }
  onModelChangeA($event) { console.log(this.modelRadioA, $event) }
  onModelChangeB($event) { console.log(this.modelRadioA, $event) }

}
