import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ShareBaseSearch, ShareResult } from 'share-libs/src/model';
import { ShareBaseService } from 'share-libs/src/servers';
import { PaginationPage } from '../../pagination/share-pagination.model';
import { SharePage, TableClassName, TableItem, TableSelect } from '../share-table.model';

@Component({
  selector: 'share-table',
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.less']
})
export  class  TableComponent implements OnInit {
  constructor(private http: ShareBaseService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement
  }
  @Input() inApiUrl: string = [][0];//
  @Input() inSearchObj: any;
  @Input() inItems: Array<TableItem> = [
    { title: '', type: 'check', width: 60, styckyLeft: '0px' },
    { title: '序号', type: 'serial', width: 60, styckyLeft: '62px' },
    { title: '时间', property: 'taskDate', width: 150 },
    {
      title: '收/发', property: 'connectDirect', width: 90, type: "tag",
      tagRule: [
        { tagType: 'org', value: '0', text: '发送' },
        { tagType: 'primary', value: '1', text: '接收' }
      ]
    },
    { title: '变更内容', property: 'detail', width: 200 },
    {
      title: '报文类型', property: 'type', width: 180
    },
    { title: '操作用户', property: 'userName', width: 180 },
    {
      title: '执行结果', property: 'exeResult', type: "tag", width: 180, tagRule: [
        { value: 0, text: '成功', tagType: 'success' },
        { value: 1, text: '失败', tagType: 'danger' },
        { value: 2, text: '队列中', tagType: 'default' },
        { value: 3, text: '等待回复', tagType: 'default' },
      ]
    },
    {
      title: '参数详情', property: 'parameterId', type: "expend", width: 60
    },
  ];
  @Input() inUuid: string = "id";//数据唯一标识
  @Input() inAllDatas: any[] = [];//表格数据
  @Input() inSelectedDatas: Array<any> = [];//已经选中的数据
  @Input() inDisableDatas: Array<any> = [];//禁止改动选择状态的数据
  @Input() inClassNames: TableClassName[] = ["simple-border","background-color"];
  nativeEl: HTMLElement;
  tableDatas: any[] = [];//表格数据
  tableSelectedUuids: Array<string> = [];//选中的数据的唯一标识集合
  tableDisableUuids: Array<string> = [];//禁用数据的唯一标识集合
  page: SharePage = new SharePage();
  searchItem: ShareBaseSearch = new ShareBaseSearch();
  pageRecordOptions: number[] = [15, 20, 30, 50];
  @Output() emitSelectChange: EventEmitter<TableSelect> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.searchObj && changes.searchObj.currentValue) {
      //查询
      Object.assign(this.searchItem, this.inSearchObj);
      this.getList();
    }
    if (changes.inSelectedDatas) {
      //传入选中数据
      this.setTableSelectedUuidsByDatas()
    }
    if (changes.inDisableDatas) {
      //传入禁用数据
      this.setTableDisableUuidsByDatas()
    }
    if (changes.inAllDatas && this.inAllDatas.length > 0) {
      //用户自己传入表格数据非后台查询
      this.page.recordCount = this.inAllDatas.length;
      this.page = Object.assign({}, this.page)
    }
    this.onChanges(changes)
  }

  ngAfterViewInit(): void {
    let allWith = 0;
    this.inItems.forEach(e => e.width && (allWith += e.width) || e.widthMin && (allWith += e.widthMin) || (allWith += 60))
    let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
    if (tableWidth <= allWith) {
      Promise.resolve().then(res => {
        this.inItems.forEach(e => e.width || (e.widthMin && (e.width = e.widthMin)) || (e.width = 60))
      })
    }
  }

  onChanges(changes: SimpleChanges) {
  }

  ngOnInit(): void {
    this.setTableSelectedUuidsByDatas();
    this.setTableDisableUuidsByDatas()
    // this.inAllDatas = [];
    // for (let i = 0; i < 100; i++) {
    //   let data = {
    //     id: i, taskDate: 100 - i, connectDirect: '0', detail: 'detail' + i, type: '0', userName: '0', exeResult: '0', parameterId: '0'
    //   }
    //   this.inAllDatas.push(data);
    // };
    this.getList();
    this.superInit();
  }

  superInit() { }

  getList() {
    if (this.inApiUrl) {
      this.getDatasByHttp()
    } else {
      this.page.recordCount = this.inAllDatas.length;
      this.page = Object.assign({}, this.page);
      let page = this.page;
      let pageRecord = page.pageRecord;
      this.tableDatas = this.inAllDatas.slice((page.currentPage - 1) * pageRecord, page.currentPage * pageRecord);
      this.superGetListAfter();
    }
  }

  getDatasByHttp() {
    this.http.post(this.inApiUrl, this.searchItem).subscribe((res: ShareResult) => {
      if (res.rlt == 0) {
        this.page = res.datas;
        this.tableDatas = res.datas && res.datas.result || [];
        this.superGetListAfter();
      }
    })
  }
  superGetListAfter(){};

  checkThead(flag, datas = this.tableDatas) {
    let changeDatas = []
    datas.forEach((e) => { if (!this.getDataDisableStatus(e)) { this.checkedData(flag, e, changeDatas) } });
    this.emitSelectChange.emit(new TableSelect(flag, changeDatas, this.inSelectedDatas, this.tableSelectedUuids))
  }

  checkedData(flag, data, changeDatas: any[] = undefined) {
    if (flag) {
      if (this.tableSelectedUuids.includes(data[this.inUuid])) return;
      this.tableSelectedUuids.push(data[this.inUuid]);
      this.inSelectedDatas.push(data);
    } else {
      this.tableSelectedUuids = this.tableSelectedUuids.filter(e => e != data[this.inUuid]);
      this.inSelectedDatas = this.inSelectedDatas.filter(e => e[this.inUuid] != data[this.inUuid]);
    }
    changeDatas && changeDatas.push(data);
    if (!changeDatas) {
      this.emitSelectChange.emit(new TableSelect(flag, [data], this.inSelectedDatas, this.tableSelectedUuids))
    }
  }

  setTableSelectedUuidsByDatas() {
    this.tableSelectedUuids = this.inSelectedDatas.map(e => e[this.inUuid])
  }

  setTableDisableUuidsByDatas() {
    this.tableDisableUuids = this.inDisableDatas.map(e => e[this.inUuid])
  }

  pageChange(page: PaginationPage) {
    let currentPage = page.currentPage;
    let pageRecord = page.pageRecord;
    if (this.searchItem.currentPage == currentPage && this.searchItem.pageRecord == pageRecord) return;
    Object.assign(this.searchItem, { currentPage, pageRecord });
    this.getList();
  }


  headMix(datas = this.tableDatas): boolean {
    let flag = datas.some(e => this.tableSelectedUuids.includes(e[this.inUuid]))
    return flag;
  }

  headAllSelect(datas = this.tableDatas): boolean {
    let flag = datas.every(e => this.tableSelectedUuids.includes(e[this.inUuid]) || this.tableDisableUuids.includes(e[this.inUuid])) && datas.length > 0;
    return flag;
  }

  getDataCheckStatus(data): boolean {
    let flag = this.tableSelectedUuids.includes(data[this.inUuid])
    return flag;
  }
  getDataDisableStatus(data): boolean {
    let flag = this.tableDisableUuids.includes(data[this.inUuid])
    return flag;
  }
}