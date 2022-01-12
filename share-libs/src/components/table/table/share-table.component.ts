import { Component, OnInit } from '@angular/core';
import { throttleTime } from 'rxjs/internal/operators/throttleTime';
import { ModalChange } from '../../open-modals/modal-select-item/modal-select-item.component';
import { TableBase } from '../share-table-base.component';
import { TableItem } from '../share-table.model';

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

  onRule(data, item: TableItem) {
    let type = item.type, key;
    switch (type) {
      case "rule-btns": key = "ruleBtns"; break;
      case "rule-dots": key = "ruleDots"; break;
      case "rule-tags": key = "ruleTags"; break;
      case "rule-text": key = "ruleText"; break;
      default: return;
    }
    if (typeof item[key] === 'function') {
      return item[key](data, item, this.tableDatas)
    } else {
      return item[key]
    }
  }
}


