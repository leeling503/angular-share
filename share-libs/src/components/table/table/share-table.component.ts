import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ShareBaseSearch, ShareResult } from 'share-libs/src/models';
import { ShareBaseHttpService } from 'share-libs/src/services';
import { PaginationPage } from '../../pagination/share-pagination.model';
import { SharePage, TableClassName, TableItem, TableSelect } from '../share-table.model';

@Component({
  selector: 'share-table',
  templateUrl: './share-table.component.html',
  styleUrls: ['./share-table.component.less']
})
export class TableComponent implements OnInit {
  constructor(private http: ShareBaseHttpService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement
  }
  /**后台url路径 */
  @Input() inApiUrl: string = [][0];
  /**后台异步获取数据时是否开启遮罩  默认true*/
  @Input() inLoading: boolean = true;
  /**后台异步获取数据时搜索条件 */
  @Input() inSearchObj: ShareBaseSearch;
  /**表头配置  true*/
  @Input() inItems: Array<TableItem> = [
    { title: '', type: 'check', width: 60, canFilter: false, styckyLeft: '0px' },
    { title: '序号', type: 'serial', width: 60, canFilter: false, styckyLeft: '62px', },
    { title: '时间', key: 'taskDate', width: 150, canFilter: false },
    {
      title: '收/发', key: 'connectDirect', width: 90, type: "tag",
      tagRule: [
        { tagType: 'org', value: '0', text: '发送' },
        { tagType: 'primary', value: '1', text: '接收' }
      ]
    },
    { title: '变更内容', key: 'detail', width: 200 },
    {
      title: '报文类型', key: 'type', width: 180
    },
    { title: '操作用户', key: 'userName', width: 180 },
    {
      title: '执行结果', key: 'exeResult', type: "tag", width: 180, tagRule: [
        { value: 0, text: '成功', tagType: 'success' },
        { value: 1, text: '失败', tagType: 'danger' },
        { value: 2, text: '队列中', tagType: 'default' },
        { value: 3, text: '等待回复', tagType: 'default' },
      ]
    },
    {
      title: '参数详情', key: 'parameterId', type: "expend", width: 60
    },
  ];
  /**表格数据的唯一标识key  默认id*/
  @Input() inUuid: string = "id";
  /**非后台获取时传入的表格数据 */
  @Input() inAllDatas: any[] = [];
  /**已经选中的表格数据 */
  @Input() inSelectedDatas: Array<any> = [];
  /**禁止改动选择状态的数据 */
  @Input() inDisableDatas: Array<any> = [];
  /**表格样式  "border" | "simple-border" | "background-color"*/
  @Input() inClassNames: TableClassName[] = ["border", "background-color"];

  @Input() inCheckKey: string = "share-check";
  nativeEl: HTMLElement;
  /**表格数据 */
  tableDatas: any[] = [];//
  /**选中的数据的唯一标识集合 */
  tableSelectedUuids: Array<string> = [];
  /**禁用数据的唯一标识集合 */
  tableDisableUuids: Array<string> = [];
  page: SharePage = new SharePage();
  paginPage: SharePage = new SharePage();
  searchItem: ShareBaseSearch = new ShareBaseSearch();
  pageRecordOptions: number[] = [15, 20, 30, 50];
  loadingFlag: boolean = false;
  @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();

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
      // this.paginPage = Object.assign({}, this.page)
    }
    this.superChanges(changes)
  }

  ngAfterViewInit(): void {
    this.setTableWidth();
  }

  setTableWidth() {
    let allWith = 0, computeWidth = 0, len = this.inItems.length - 1;;
    this.inItems.forEach(e => {
      if (e.ifShow !== false) {
        allWith += (e.width || e.widthMin || 60);
        if (!e.styckyLeft) {
          computeWidth += (e.width || e.widthMin || 60)
        }
      }
    })
    let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
    if (this.inClassNames.includes('border')) {
      tableWidth -= (len + 2)
    }
    if (tableWidth <= allWith) {
      Promise.resolve().then(res => {
        this.inItems.forEach(e => e._width = e.width || e.widthMin || 60)
      })
    } else if (tableWidth > allWith) {
      let extraWidth = tableWidth, len = this.inItems.length - 1;
      Promise.resolve().then(res => {
        this.inItems.forEach((e, i) => {
          if (i === len) {
            e._width = extraWidth;
          } else if (e.styckyLeft) {
            e._width = e.width;
          } else {
            e._width = (extraWidth * e.width / computeWidth) | 0;
            computeWidth -= e.width;
          }
          extraWidth -= e._width;
        })
      })
    }
  }

  ngOnInit(): void {
    // this.inAllDatas = [];
    // for (let i = 0; i < 100; i++) {
    //   let data = {
    //     id: i, taskDate: 100 - i, connectDirect: '0', detail: 'detail' + i, type: '0', userName: '0', exeResult: '0', parameterId: '0'
    //   }
    //   this.inAllDatas.push(data);
    // };
    // this.page.recordCount = this.inAllDatas.length;
    this.paginPage = Object.assign({}, this.page)
    this.setTableSelectedUuidsByDatas();
    this.setTableDisableUuidsByDatas();
    this.getList();
    this.superInitAfter();
  }

  setTableSelectedUuidsByDatas() {
    this.tableSelectedUuids = this.inSelectedDatas.map(e => e[this.inUuid])
  }

  setTableDisableUuidsByDatas() {
    this.tableDisableUuids = this.inDisableDatas.map(e => e[this.inUuid])
  }

  getList() {
    this.superGetListBefor();
    if (this.inApiUrl) {
      if (this.inLoading) {
        this.loadingFlag = true;
      }
      this.getDatasByHttp()
    } else {
      let page = this.page = this.paginPage;
      let pageRecord = page.pageRecord;
      this.tableDatas = this.inAllDatas.slice((page.currentPage - 1) * pageRecord, page.currentPage * pageRecord);
      this.superGetListAfter();
    }
  }

  getDatasByHttp() {
    this.http.post(this.inApiUrl, this.searchItem).subscribe((res: ShareResult) => {
      this.loadingFlag = false;
      if (res.rlt == 0) {
        this.page = res.datas;
        this.paginPage = Object.assign({}, this.page);
        this.tableDatas = res.datas && res.datas.result || [];
        this.superGetListAfter();
      }
    })
  }

  superChanges(changes: SimpleChanges) { }
  superInitAfter() { }
  superGetListBefor() { }
  superGetListAfter() { };

  checkThead(flag, datas = this.tableDatas, thead = this.inItems) {
    let changeDatas = []
    datas.forEach((e) => { if (!this.getDataDisableStatus(e)) { this.checkedData(flag, e, changeDatas) } });
    this.onSelectChange.emit(new TableSelect(flag, changeDatas, this.inSelectedDatas, this.tableSelectedUuids))
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
      this.onSelectChange.emit(new TableSelect(flag, [data], this.inSelectedDatas, this.tableSelectedUuids))
    }
  }

  pageChange(page: PaginationPage) {
    let currentPage = page.currentPage, pageRecord = page.pageRecord;
    if (this.searchItem.currentPage == currentPage && this.searchItem.pageRecord == pageRecord) return;
    Object.assign(this.searchItem, { currentPage, pageRecord });
    this.getList();
  }

  /** 表头显示列有改变 */
  onChangeItemFilter() {
    this.setTableWidth();
  }

  //以下方案待优化
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