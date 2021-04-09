import { Component, OnInit } from '@angular/core';
import { CbUtileDotFun, CbUtileTagFun, CbUtileTextFun, TableItem, TagRule, TagRules } from 'share-libs/src/components/table/share-table.model';

@Component({
  selector: 'ex-share-table',
  templateUrl: './ex-share-table.component.html',
  styleUrls: ['./ex-share-table.component.less']
})
export class ExShareTableComponent implements OnInit {
  /**表格数据*/
  allDatas: any[];
  items: TableItem[];
  // apiUrl: string = '';
  apiUrl = 'api/Statuslist/getList';
  constructor() { }


  ngOnInit() {
    this.allDatas = [];
    for (let i = 0; i < 100; i++) {
      let data = {
        id: i, collectionTime: 'detail' + i, aidsName: '站点' + (100 - i), ifAlarm: Math.random() + 0.5 | 0, ifBind: Math.random() + 0.5 | 0, ifMark: i % 3 == 0 ? 'success' : i % 3 == 1 ? 'defeated' : 'asdasd', commModeCodeName: '北斗'
      }
      this.allDatas.push(data);
    };

    this.items = [
      { title: '', type: 'check', width: 60, canFilter: false, styckyLeft: '0px' },
      { title: '序号', type: 'serial', width: 60, canFilter: false, styckyLeft: '62px', },
      { title: '时间', key: 'collectionTime', width: 80, canFilter: false },
      {
        title: '名称', key: 'aidsName', width: 50, type: "expend"
      },
      {
        title: '是否绑定', key: 'ifBind', type: 'dot', width: 50, cbDot: (data, item) => CbUtileDotFun(data, item,
          {
            get 0(): TagRule { console.log('getname'); return { value: '0', class: 'green', text: '未绑定', color: '#13C4B0' } },
            1: { value: '0', class: 'blue', text: '已绑定', color: 'orange' },
          })
      },
      {
        title: '报警', key: 'ifAlarm', type: 'dot', width: 50, cbDot: (data, item) => CbUtileDotFun(data, item,
          {
            get 0(): TagRule { console.log('getname'); return { value: '0', class: 'green', text: '正常', color: '#13C4B0' } },
            1: { value: '0', class: 'danger', text: '报警', color: '#F04864' },
          })
      },
      { title: '站点名称', key: 'aidsName', width: 80 },
      {
        title: '执行结果', key: 'ifMark', type: "tag", width: 80, cbTag: (data, item) => CbUtileTagFun(data, item,
          {
            get success(): TagRule { console.log('getname'); return { value: '0', class: 'green', text: '成功', color: '#FFF' } },
            defeated: { value: '0', class: 'danger', text: '失败', color: 'blue' },
          })
      },
      {
        title: '参数详情', key: 'commModeCodeName', type: "text", width: 60, cbText: (data, item) => CbUtileTextFun(data, item)
      },
    ]
  }

}
