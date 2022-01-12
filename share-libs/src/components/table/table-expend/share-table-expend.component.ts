import { Component, OnInit, ElementRef, Renderer2, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { HttpBaseService } from 'share-libs/src/services/http-base.service';
import { TableComponent } from '../table/share-table.component';

@Component({
  selector: 'share-table-expend',
  templateUrl: './share-table-expend.component.html',
  styleUrls: ['../table/share-table.component.less', './share-table-expend.component.less']
})
export class TableExpendComponent extends TableComponent implements OnInit {
  constructor(http: HttpBaseService, el: ElementRef) {
    super(http, el);
  }
  @Input() inTempRef: TemplateRef<any>
  tableExpend: boolean = false;//是否有展开列
  expendIndex: number = undefined;//展开列序号

  superInitAfter() {
    this.expendIndex = undefined;
    this.tableExpend = this.inItems.some(e => e.type == 'expend');
  }

  superGetListBefor() {
    this.expendIndex = undefined;
  }

  onExpendLine(item, index) {
    this.expendIndex = index == this.expendIndex ? [][0] : index;
    if (this.expendIndex === [][0]) {
      return;
    }
  }
}