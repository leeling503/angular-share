import { Component, OnInit } from '@angular/core';
import { RadiosData, RadiosPara } from 'share-libs/src/components/radio/share-radio.model';

@Component({
  selector: 'ex-share-radio',
  templateUrl: './ex-share-radio.component.html',
  styleUrls: ['./ex-share-radio.component.less']
})
export class ExShareRadioComponent implements OnInit {
  constructor() { }
  radioDatasA: RadiosData[];
  radioDatasB: RadiosData[];
  radioDatasC: RadiosData[];
  radioDatasD: RadiosData[];
  radioDatasE: RadiosData[];
  radioParaA: RadiosPara;
  radioParaB: RadiosPara = {
    multi: false,
    iconType: 'check',
    valueKey: 'value',
    disCancel: false,
    clear: false
  };;
  radioParaC: RadiosPara = {
    multi: false,
    iconType: 'radio',
    valueKey: 'key',
    clear: true
  };
  radioParaD: RadiosPara = {
    multi: true,
    iconType: 'cricle',
    valueKey: 'key',
    disCancel: true,
    clear: true
  };
  radioParaE: RadiosPara = {
    multi: true,
    iconType: 'cricle',
    clear: false
  };
  modelRadioA = ['1'];
  modelRadioB = '';
  modelRadioC = '';
  modelRadioD = ['1'];
  modelRadioE = ['1'];


  ngOnInit() {
    setTimeout(() => {
      this.radioDatasA = [
        { key: '1', value: 10 },
        { key: '2', value: 0 },
        { key: '3', value: 20 },
        { key: '4', value: 'false' },
        { key: '5', value: undefined },
      ]
      this.radioDatasB = [
        { key: '1', value: 10, ifCheck: false, ifDis: false },
        { key: '2', value: 0, ifCheck: true, ifDis: true },
        { key: '4', value: 'false', ifCheck: false, ifDis: false },
        { key: '5', value: undefined, ifCheck: false, ifDis: false },
      ]
      this.radioDatasC = [
        { key: '1', value: 10, ifCheck: false, ifDis: false },
        { key: '2', value: 0, ifCheck: true, ifDis: true },
        { key: '3', value: 20, ifCheck: false, ifDis: false },
        { key: '4', value: 'false', ifCheck: false, ifDis: false },
        { key: '5', value: undefined, ifCheck: false, ifDis: false },
      ]
      this.radioDatasD = [
        { key: '1', value: 10 },
        { key: '2', value: 0 },
        { key: '3', value: 20 },
        { key: '4', value: 'false' },
        { key: '5', value: undefined },
      ]
      this.radioDatasE = [
        { key: '1', value: 10 },
        { key: '2', value: 0 },
        { key: '3', value: 20 },
        { key: '4', value: 'false' },
        { key: '5', value: undefined },
      ]
    }, 100);
  }

  onModelChangeA($event) { console.log(this.modelRadioA, $event) }
  onModelChangeB($event) { console.log(this.modelRadioB, $event) }
  onModelChangeC($event) { console.log(this.modelRadioC, $event) }
  onModelChangeD($event) { console.log(this.modelRadioD, $event) }
  onModelChangeE($event) { console.log(this.modelRadioE, $event) }

}
