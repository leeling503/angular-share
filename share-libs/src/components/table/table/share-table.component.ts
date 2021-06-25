import { Component, OnInit } from '@angular/core';
import { TableBase } from '../share-table.component';
import { BtnRule, BtnRules, TableItem } from '../share-table.model';

@Component({
  selector: 'share-table',
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.less']
})
export class TableComponent extends TableBase implements OnInit {

  onClick(data, item: TableItem) {
    if (item.onClick && typeof item.onClick == 'function') {
      item.onClick(data, item)
    }
  }

  onRuleBtns(data, item: TableItem): BtnRules {
    if (typeof item.ruleBtns === 'function') {
      return item.ruleBtns(data)
    } else {
      return item.ruleBtns
    }
  }


  onRuleBtnClick(data, item, btn: BtnRule, datas) {
    if (btn.onClick && typeof btn.onClick == 'function') {
      btn.onClick(data, item, datas)
    }
  }
}


