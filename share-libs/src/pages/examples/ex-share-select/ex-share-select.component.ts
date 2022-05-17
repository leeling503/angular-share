import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { RadioOption } from 'share-libs/src/components/radio/share-radio.model';
import { SelectModel, SelectOption, SelectOptions, SelectPara } from 'share-libs/src/components/select/share-select.model';

@Component({
  selector: 'ex-share-select',
  templateUrl: './ex-share-select.component.html',
  styleUrls: ['./ex-share-select.component.less']
})
export class ExShareSelectComponent implements OnInit {
  options = [
    {
      key: '1', value: 'A', showName: '改变显示的值', children:
        [{
          key: '11', value: 'Aa', _dis: true, children:
            [
              { key: '111', value: 'Aaa' },
              { key: '112', value: 'Aab' }]
        }, {
          key: '12', value: 'Absd', children:
            [
              { key: '121', value: 'Abasd' },
              {
                key: '122', value: 'Abbsd', children:
                  [
                    { key: '1211', value: 'Abasd' },
                    {
                      key: '1221', value: 'Abbsd',
                      children: [
                        { key: '12111', value: 'Abasd' },
                        { key: '12211', value: 'Abbsd' }
                      ]
                    }]
              }]
        }]
    }, {
      key: '2', value: 'B', children:
        [{ key: '21', value: 'Ba' }]
    }, {
      key: '3', value: 'C', children:
        [{ key: '31', value: 'Ca' }]
    }, {
      key: '4', value: 'D', children:
        [{ key: '41', value: 'Da' }]
    }, {
      key: '5', value: 'E', children:
        [{ key: '51', value: 'Ea' }]
    },
  ]
  constructor() { }
  modelC
  config: SelectPara = {};
  model = ['3']
  ngOnInit() {
    this.setSelectA();
    this.setSelectB();
    this.setSelectC();
  }

  onParaChange() {
    this.paraA = Object.assign({}, this.paraA);
  }

  radioData: RadioOption[] = [{ key: true, value: '是' }, { key: false, value: '否' }]
  outTypeData: RadioOption[] = [{ key: 'string', value: 'string' }, { key: 'strings', value: 'strings' }, { key: 'object', value: 'object' }, { key: 'objects', value: 'objects' }]
  paraA: SelectPara = {
    ifMulti: false, ifCheck: true, ifSon: true, ifAdd: false, ifFlag: true, ifClear: true, ifOne: true, ifActive: false, ifGanged: true, ifClose: true, ifAuto: true
  }
  optionsA
  modelA = []
  activeA;
  setSelectA() {
    this.optionsA = Object.assign([], this.options)
  }

  onActiveChangeA($event) {
    this.activeA = $event
  }

  modelB;
  optionsB: SelectOption[] = [];
  paraB: SelectPara = {};
  setSelectB() {
    this.modelB = "A51,B";
    // this.modelB = [];
    setTimeout(() => {
      this.optionsB = [{
        key: 'A', value: '中国', showName: '最强', children: [
          { key: 'A1', value: '北京市' },
          { key: 'A2', value: '天津市' },
          { key: 'A3', value: '上海市' },
          { key: 'A4', value: '重庆市' },
          {
            key: 'A5', value: '湖南省', children: [
              { key: 'A51', value: '长沙', },
              { key: 'A52', value: '常德', },
              { key: 'A53', value: '岳阳', },
            ]
          },
          {
            key: 'A6', value: '湖北省', children: [
              { key: 'A61', value: '武汉', },
              { key: 'A62', value: '黄冈', },
              { key: 'A63', value: '赤壁', },
            ]
          },
          {
            key: 'A7', value: '广东省', children: [
              { key: 'A71', value: '广州', },
              { key: 'A72', value: '深圳', },
              { key: 'A73', value: '湛江', },
            ]
          },
        ]
      },
      {
        key: 'B', value: '美国', children: [
          { key: 'B1', value: 'USA B1' },
          { key: 'B2', value: 'USA B2' },
          { key: 'B3', value: 'USA B3' },
        ]
      },
      {
        key: 'C', value: '俄国', children: [
          { key: 'C1', value: 'C1' },
          { key: 'C2', value: 'C2' },
          { key: 'C3', value: 'C3' },
        ]
      },
      {
        key: 'D', value: '韩国', children: [
          { key: 'D1', value: 'D1' },
          { key: 'D2', value: 'D2' },
          { key: 'D3', value: 'D3' },
        ]
      },
      ]
    }, 5000);
  }

  optionC = [];
  optionsC: SelectOption[] = [];
  paraC: SelectPara = {};
  setSelectC() {
    this.paraC.ifOne = true;
    this.paraC.overlayWidth = 200;
    this.optionsC = _.cloneDeep(this.options);
  }

  onActiveChange($event) {
    console.log($event)
  }

  addOptions: SelectOptions
  addModel: SelectModel = ['A']

  setSelectAdd() {
    setTimeout(() => {
      this.addOptions = [
        { key: 'A', value: '一' },
        { key: 'B', value: '二' }
      ]
      console.log('setTimeout')
    }, 1000);
  }
}
