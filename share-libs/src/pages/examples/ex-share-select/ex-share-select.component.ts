import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ShareModalRef } from 'share-libs/src/components/modal/modalRef.service';
import { SelectConfig, SelectOption } from 'share-libs/src/components/select/share-select.model';

@Component({
  selector: 'ex-share-select',
  templateUrl: './ex-share-select.component.html',
  styleUrls: ['./ex-share-select.component.less']
})
export class ExShareSelectComponent implements OnInit {

  constructor() { }
  optionsA: SelectOption[] = [
    { key: '0', value: 'A' },
    { key: '1', value: 'B' },
    { key: '2', value: 'C' },
    { key: '3', value: 'D' },
    { key: '4', value: 'E' },
    { key: '5', value: 'F' },
  ]
  modelA = [{ key: '3', value: 'D' }]

  default = [
    {
      key: '1', value: 'A', showName: '改变显示的值', children:
        [{
          key: '11', value: 'Aa', children:
            [{ key: '111', value: 'Aaa' }, { key: '112', value: 'Aab' }]
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
  optionD = ["61"]
  ngOnInit() {
    this.setSelectA();
    this.setSelectB();
    this.setSelectC();
    this.setSelectD();
    this.setSelectE();
  }

  option = [];
  config: SelectConfig = new SelectConfig();

  optionA = [];
  configA: SelectConfig = new SelectConfig();
  setSelectA() {
    this.configA.ifMulti = true;
    this.optionA = ["12", "31"]
  }

  optionB;
  optionsB: SelectOption[] = [];
  configB: SelectConfig = new SelectConfig();
  setSelectB() {
    this.configB.ifActive = true;
    this.optionB = "12";
    this.optionsB = _.cloneDeep(this.default);
  }

  optionC = [];
  optionsC: SelectOption[] = [];
  configC: SelectConfig = new SelectConfig();
  setSelectC() {
    this.configC.leastOne = true;
    this.configC.openWidth = 200;
    this.optionsC = _.cloneDeep(this.default);
  }

  configD: SelectConfig = new SelectConfig()
  setSelectD() {
    this.configD.placeholder = '自己设置的提示语';
    this.configD.noneTip = "自己设置的无数据提示语"
  }


  configE: SelectConfig = new SelectConfig()
  optionE = [];
  setSelectE() {
    this.configE.ifCheck = false;
    this.configE.ifMulti = true;
  }








  modelOptionChange($event) {
    console.log($event)
  }
  onActiveChange($event) {
    console.log($event)
  }
}
