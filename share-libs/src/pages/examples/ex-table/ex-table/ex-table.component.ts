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
  items: TableItem[];
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
      { title: '时间', key: 'collectionTime', classNames: ['color-blue', 'underline'], onClick: (data, item) => { console.log(data, item) }, widthFixed: 150, canFilter: false },
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
        title: '执行结果', key: 'functionCode', type: "rule-tag", width: 230, ruleTags: UtilTableRuleTags({
          get '01'(): TagRule { console.log('getname'); return { value: '0', class: 'green', text: '成功', color: '#FFF' } },
          '02': { value: '0', class: 'danger', text: '失败', color: 'orange' },
        })
      },
      { title: '站点名称', key: 'aidsName2', width: 230 },
      { title: '参数详情', key: 'commModeCodeName', type: "rule-text", width: 220, ruleText: UtilTableRuleText({}) },
    ]
  }

  onSelectChange($event) {
    console.log($event)
  }

}
