import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableData, BtnRules, TableClassName, TableItem, TableMultiAllItems, TagRule, TagRules } from 'share-libs/src/components/table/share-table.model';
import { SizeBtn, TypeBtn } from 'share-libs/src/enum';
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
  // tableClass: TableClassName[] = ['view-left', 'simple-border', 'border', 'background-color'];
  tableClass: TableClassName[]
  apiUrl;
  inUuid = 'aidsName';
  selectedDatas = [
    { aidsName: "曹妃甸B11#灯浮" },
    { aidsName: '天津港3号灯浮' },
    { aidsName: '站点99' },
    { aidsName: '站点95' },
    { aidsName: "天津港G1#活节式灯桩" }]

  disableDatas = [
    { aidsName: '站点98' },
    { aidsName: '站点95' },
  ];
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.allDatas = [];
      for (let i = 0; i < 100; i++) {
        let data: Partial<ItemData> = {
          id: i, collectionTime: 'detail' + i, aidsName: '站点' + (100 - i), ifAlarm: (Math.random() + 0.5 | 0).toString(), ifBind: (Math.random() + 0.5 | 0).toString(), ifMark: i % 3 == 0 ? 'success' : i % 3 == 1 ? 'defeated' : 'asdasd', commModeCode: '北斗', functionCode: (Math.random() * 3 + 0.5 | 0).toString(),
        }
        this.allDatas.push(data);
      };
    }, 1000);
    this.items = [
      { title: '选框', type: 'check', width: 60, filterCan: false, filterHid: true, styckyLeft: '0px' },
      { title: '序号', type: 'serial', width: 60, filterCan: false, styckyLeft: '60px', },
      { title: '标识符', key: 'id', width: 60 },
      { title: '时间', key: 'collectionTime', classNames: ['color-blue', 'underline'], onClick: (data, item) => { console.log(data, item) }, widthFix: 150, filterCan: false },
      { title: '名称1', key: 'aidsName', classNames: ['view-center'], width: 60 },
      { title: 'ifAlarm', key: 'ifAlarm', filterCan: false, classNames: ['view-center'], width: 60 },
      {
        title: '报警', key: 'ifAlarm', type: 'rule-dots', width: 60, ruleDots: (data, item, datas) => {
          let res = data.ifAlarm ? '是' : '否';
          data._ruleDots = [{ text: res, class: 'orange' }]
          return [{ text: res, class: 'orange' }]
        }
      },
      { title: 'ifBind', key: 'ifBind', filterCan: false, classNames: ['view-center'], width: 60 },
      {
        title: '是否绑定', key: 'ifBind', type: 'rule-text', filterCan: false, width: 60, ruleText: (data, item) => {
          let str = data.ifBind + data.ifBind;
          console.log('是否绑定')
          return [str,str]
        }
      },
      { title: 'ifMark', key: 'ifMark', filterCan: false, classNames: ['view-center'], width: 60 },
      {
        title: "绑定", key: 'opertion', type: "rule-btns", widthFix: 60, ruleBtns: (data, item) => {
          console.log("操作")
          let btns: BtnRules = []
          if (data.id % 3 == 0) {
            btns = [
              { text: '添加', click: () => { console.log(data) }, size: SizeBtn.smallX, type: TypeBtn.primary },
              { text: '编辑', click: () => { console.log(data) }, size: SizeBtn.smallX, type: TypeBtn.default },
              { text: '删除', click: () => { console.log(data) }, size: SizeBtn.smallX, type: TypeBtn.danger },
            ]
          } else {
            btns = [
              { text: '操作02', click: () => { console.log(data) } }
            ]
          }
          data._ruleBtnKey = (data._ruleBtn || {});
          data._ruleBtnKey[item.key] = btns;
          return btns;
        }
      },
      { title: '名称2', key: 'commModeCode', filterCan: false, classNames: ['view-center'], width: 60 },
      { title: '名称2', key: 'functionCode', filterCan: false, classNames: ['view-center'], width: 60 },
      {
        title: '执行结果', key: 'functionCode', type: "rule-tags", width: 60, ruleTags: (data, item, datas) => {
          data._ruleTags = [{ text: data.functionCode, class: 'orange' }]
          return [{ text: data.functionCode, class: 'orange' }]
        }
      },
      {
        title: "操作", key: 'opertion2', type: "rule-btns", widthFix: 60, ruleBtns: [
          { text: '操作02', click: () => { console.log('click') }, type: TypeBtn.primary, size: SizeBtn.small }
        ], onClick: (data, item, datas) => { console.log(data, item, datas) }
      }
    ]
    // setTimeout(() => {
    //   this.apiUrl = 'api/Statuslist/getList'
    // }, 5000);
  }

  onSelectChange($event) {
    console.log($event)
  }

}



class ItemData extends TableData {
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
  id: number;
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