import { Component, OnInit } from '@angular/core';
import { TableBase } from '../share-table';
import { TableItem } from '../share-table.model';

@Component({
  selector: 'share-table',
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.less']
})
export class TableComponent extends TableBase implements OnInit {

  onShowBc(data, item: TableItem) {
    if (item.cbText && typeof item.cbText == 'function') {
      return item.cbText(data, item)
    }
    return data[item.key];
  }
}


