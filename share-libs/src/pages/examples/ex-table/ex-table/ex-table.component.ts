import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableItem, TableMultiAllItems, TagRule, TagRules } from 'share-libs/src/components/table/share-table.model';
import { UtilRouterGetUrl } from 'share-libs/src/utils/util-router';
import { UtilTableRuleDots, UtilTableRuleTags, UtilTableRuleText } from 'share-libs/src/utils/util-table';

@Component({
  selector: 'ex-table',
  templateUrl: './ex-table.component.html',
  styleUrls: ['./ex-table.component.less']
})
export class ExTableComponent implements OnInit {
  /**表格数据*/
  allDatas: any[];
  items: TableItem<ItemData>[];
  // apiUrl: string = '';
  apiUrl = 'api/Statuslist/getList';
  inUuid = 'aidsName';
  selectedDatas = [
    { aidsName: "曹妃甸B11#灯浮" },
    { aidsName: '天津港3号灯浮' },
    { aidsName: '站点99' },
    { aidsName: '站点88' },
    { aidsName: "天津港G1#活节式灯桩" }]
  constructor() { }

  ngOnInit() {
    this.allDatas = [];
    for (let i = 0; i < 100; i++) {
      let data = {
        id: i, collectionTime: 'detail' + i, aidsName: '站点' + (100 - i), ifAlarm: Math.random() + 0.5 | 0, ifBind: Math.random() + 0.5 | 0, ifMark: i % 3 == 0 ? 'success' : i % 3 == 1 ? 'defeated' : 'asdasd', aidsName2: '', commModeCodeName: '北斗'
      }
      this.allDatas.push(data);
    };

    this.items = [
      { title: '', type: 'check', width: 60, canFilter: false, styckyLeft: '0px' },
      { title: '序号', type: 'serial', width: 60, canFilter: false, styckyLeft: '60px', },
      { title: '时间', key: 'collectionTime', classNames: ['color-blue', 'underline'], onClick: (data, item) => { console.log(data, item) }, widthFix: 150, canFilter: false },
      {
        title: '是否绑定', key: 'ifBind', type: 'rule-dot', width: 130, ruleDots: UtilTableRuleDots({
          0: { value: '0', class: 'green', text: '未绑定', color: '#13C4B0' },
          1: { value: '0', class: 'blue', text: '已绑定', color: 'orange' }
        })
      },
      { title: '名称', key: 'aidsName', width: 130, type: "expend" },
      {
        title: '报警', key: 'ifAlarm', type: 'rule-dot', width: 130, ruleDots: UtilTableRuleDots({
          0: { value: '0', class: 'green', text: '正常', color: '#13C4B0' },
          1: { value: '0', class: 'danger', text: '报警', color: '#F04864' },
        })
      },
      {
        title: '执行结果', key: 'functionCode', type: "rule-tag", width: 100, ruleTags: UtilTableRuleTags({
          get '01'(): TagRule { console.log('getname'); return { value: '0', class: 'green', text: '成功', color: '#FFF' } },
          '02': { value: '0', class: 'danger', text: '失败', color: 'orange' },
        })
      },
      {
        title: "操作", key: 'opertion', type: "rule-btns", widthFix: 100, ruleBtns: (data) => {
          if (data.functionCode == '01') {
            return [
              { text: '操作01', onClick: (data, item, datas) => { console.log(data, item, datas) } }
            ]
          } else {
            return [
              { text: '操作02', onClick: (data, item, datas) => { console.log(data, item, datas) } }
            ]
          }
        }
      }
    ]
  }

  onSelectChange($event) {
    console.log($event)
  }

}



class ItemData {
  aidsCode: string;
  aidsName: string;
  alarmLastTime: string;
  atonId: string;
  batteryVoltage: string;
  cardNumber: string;
  chargingCurrent: string;
  collectionTime: string;
  commModeCode: string;
  commModeCodeName: string;
  coordinates: string;
  datagramId: string;
  deviceCode: string;
  dutyStateCode: string;
  functionCode: string;
  id: string;
  ifAlarm: string;
  ifBind: string;
  ifIgnore: string;
  ifMark: string;
  ifOnline: string;
  ifStandby: string;
  latitude: string;
  lightColor: string;
  lightQualityName: string;
  lightUp: string;
  lightUpName: string;
  lightWorkCurrent: string;
  lightWorkVoltage: string;
  longitude: string;
  remainingBattery: string;
  shiftDistance: string;
  targeting: string;
  targetingName: string;
  thumbnail: string;
  typeCode: string;
}