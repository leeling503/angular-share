import { Component, OnInit, SimpleChanges, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { ShareBaseSearch, ShareResult } from 'share-libs/src/model';
import { ShareBaseService } from 'share-libs/src/servers';
import { TableComponent } from '../table/share-table.component';

@Component({
  selector: 'share-table-expend',
  templateUrl: './share-table-expend.component.html',
  styleUrls: ['./share-table-expend.component.less']
})
export class TableExpendComponent extends TableComponent implements OnInit {
  constructor(http: ShareBaseService,el:ElementRef) {
    super(http,el);
  }
  tableExpend: boolean = false;//是否有展开列
  expendIndex: number = [][0];//展开列序号
  onChanges(changes: SimpleChanges): void {
    this.expendIndex = [][0];
  }

  onInit(): void {
    this.tableExpend = this.inItems.some(e => e.type == 'expend');
  }

  getList() {
    this.expendIndex = [][0];
    if (this.inApiUrl) {
      this.getDatasByHttp()
    } else {
      let page = this.page;
      let pageRecord = page.pageRecord;
      this.tableDatas = this.inAllDatas.slice((page.currentPage - 1) * pageRecord, page.currentPage * pageRecord)
    }
  }

  expendLine(item, index) {
    this.expendIndex = index == this.expendIndex ? [][0] : index;
    if (this.expendIndex === [][0]) {
      return;
    }
  }
}