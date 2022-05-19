import { Component, OnInit } from '@angular/core';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';
import { ModalChange } from '../../open-modals/modal-select-item/modal-select-item.component';
import { TableBase } from '../share-table-base.component';
import { TableData, TableItem } from '../share-table.model';

@Component({
  selector: 'share-table',
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.less']
})
export class TableComponent extends TableBase implements OnInit {

  onClick(data, item: TableItem) {
    if (item.onClick && typeof item.onClick == 'function') {
      item.onClick(data, item, this.tableDatas)
    }
  }

  onRule(data: TableData, item: TableItem) {
    let type = item.type, key;
    let cache: keyof TableData
    switch (type) {
      case "rule-btns": key = "ruleBtns"; cache = "_ruleBtnKey"; break;
      case "rule-dots": key = "ruleDots"; cache = "_ruleDotKey"; break;
      case "rule-tags": key = "ruleTags"; cache = "_ruleTagKey"; break;
      case "rule-text": key = "ruleText"; cache = "_ruleTextKey"; break;
      default: return;
    }
    if (typeof item[key] === 'function') {
      return item[key](data, item, this.tableDatas)
    } else {
      data[cache] = <any>data[cache] || {};
      data[cache][item.key] = item[key];
      return item[key]
    }
  }
}


