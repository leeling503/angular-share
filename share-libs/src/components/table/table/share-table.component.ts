import { Component, OnInit } from '@angular/core';
import { TableBase } from '../share-table.component';
import { TableItem } from '../share-table.model';

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
}


