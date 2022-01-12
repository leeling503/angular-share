import { Component, OnInit } from '@angular/core';
import { ClassTableName, TableItem } from 'share-libs/src/components/table/share-table.model';

@Component({
  selector: 'app-ex-expend-table',
  templateUrl: './ex-expend-table.component.html',
  styleUrls: ['./ex-expend-table.component.less']
})
export class ExExpendTableComponent implements OnInit {
  constructor() { }
  items: TableItem[] = [
    { title: '', type: 'serial', width: 60, styckyLeft: '0px' },
    { title: '名称', key: 'name' },
    {
      title: '展开', key: 'expend', type: 'expend', classTdNames: ['color-blue', 'underline'], onClick: (data) => {
        console.log(data);
        this.name = data.name
      }
    }
  ]
  tableClass:ClassTableName[] = ['border','background-color']
  name: string;
  allDatas = [
    { name: '名称1' },
    { name: '名称2' }
  ]
  ngOnInit() {

  }

}
