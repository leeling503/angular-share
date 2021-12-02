import { ElementRef, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { HttpSearch, HttpResult } from "share-libs/src/models";
import { HttpBaseService } from "share-libs/src/services/http-base.service";
import { UtilChanges, UtilChangesNoFirst, UtilChangesValue } from "share-libs/src/utils";
import { PaginationPage } from "../pagination/share-pagination.model";
import { TableClassName, TableItem, TableSelect } from "./share-table.model";
/**
 * 表格基础逻辑类
 */
export class TableBase {
  constructor(private http: HttpBaseService, private el: ElementRef) {
    this.nativeEl = this.el.nativeElement
  }
  /**后台url路径 */
  @Input() inApiUrl: string = [][0];
  /**后台异步获取数据时是否开启遮罩  默认true*/
  @Input() inLoading: boolean = true;
  /**后台异步获取数据时搜索条件 */
  @Input() inSearchObj: HttpSearch;
  /**表头配置  true*/
  @Input() inItems: Array<TableItem> = [];
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
  /**是否分页 */
  @Input() inIfPage: boolean;
  /**是否过滤表头 */
  @Input() inIfFilter: boolean = true;
  /**分页器条数选择 */
  @Input() inRecordOptions: number[] = [15, 20, 30, 50];
  /**表格搜索条件对象（引用地址改变会重新查询） */
  searchItem: HttpSearch = new HttpSearch();
  /**表格数据 */
  tableDatas: any[] = [];
  /**选中的表格数据 */
  tableSelectedDatas: any[] = [];
  /**选中的数据的唯一标识集合 */
  tableSelectedUuids: Array<string> = [];
  /**禁用数据的唯一标识集合 */
  tableDisableUuids: Array<string> = [];
  /**分页器序号需要 */
  page: PaginationPage = {};
  /**本地Element */
  nativeEl: HTMLElement;
  /**查询加载动画 */
  loadingFlag: boolean = false;
  @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();
  @Output() onCurDataChange: EventEmitter<any[]> = new EventEmitter();


  ngOnChanges(changes: SimpleChanges): void {
    /**传入选中数据*/
    if (changes.inSelectedDatas) {
      this.setSelectedDatas();
      this.setTableSelectedUuidsByDatas();
    }
    /**传入禁用数据*/
    if (changes.inDisableDatas) {
      this.setTableDisableUuidsByDatas();
    }
    /**用户自己传入表格数据非后台查询*/
    if (UtilChangesValue(changes, 'inAllDatas') && this.inAllDatas.length > 0 && !this.inApiUrl) {
      this.page.recordCount = this.inAllDatas.length;
      this.page = Object.assign({}, this.page);
      if (UtilChangesNoFirst(changes, 'inAllDatas')) {
        this.getList();
      }
    }
    /**查询条件改变 */
    if (UtilChangesNoFirst(changes, 'inSearchObj') && this.inSearchObj) {
      Object.assign(this.searchItem, this.inSearchObj);
      this.getList();
    }
    if (UtilChangesNoFirst(changes, 'inApiUrl') && this.inApiUrl) {
      this.getList()
    }
    this.superChanges(changes)
  }

  ngOnInit(): void {
    this.getList();
    this.superInitAfter();
  }


  ngAfterViewInit(): void {
    /**初次计算避免首次加载宽度与获得数据后计算的不统一 */
    setTimeout(() => { this.setTableWidth(); }, 10);
    /**数据过多可能出现滚动条需要重新计算 */
    let $after = this.onCurDataChange.asObservable().subscribe(res => {
      this.setTableWidth();
      $after.unsubscribe();
    })
  }

  /**表格宽度设置 */
  setTableWidth() {
    let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
    let tableMaxHeight = this.nativeEl.querySelector('.table-part').clientHeight;
    let tableHeight = this.nativeEl.querySelector('table').clientHeight;
    let allWith = 0, calcWidth = 0;
    this.inItems.forEach(e => {
      if (e.ifShow !== false) {
        allWith += (e.widthFix || e.width || e.widthMin || 60);
        if (e.styckyLeft || e.widthFix) return;
        calcWidth += (e.width || e.widthMin || 60);
      }
    })
    /**表格左侧的边框宽度  box-sizing:border-box */
    if (this.inClassNames.includes('border')) {
      tableWidth -= (1)
    }
    /**-侧边滚动条宽度 */
    if (tableHeight > tableMaxHeight) {
      tableWidth -= 6
    }
    if (tableWidth <= allWith) {
      this.inItems.forEach(e => e._width = e.widthFix || e.width || e.widthMin || 60)
    } else if (tableWidth > allWith) {
      let extraWidth = tableWidth - (allWith - calcWidth), len = this.inItems.length - 1;
      Promise.resolve().then(res => {
        let computeWidth = calcWidth;
        this.inItems.forEach((e, i) => {
          if (e.ifShow === false) { e._width = 0; return }
          let eWhidth = e.widthFix || e.width || e.widthMin || 60;
          if (e.styckyLeft || e.widthFix) {
            e._width = eWhidth;
          } else if (i === len) {
            e._width = extraWidth;
          } else {
            e._width = (extraWidth * eWhidth / computeWidth) | 0;
            computeWidth -= eWhidth;
            extraWidth -= e._width;
          }
        })
      })
    }
  }

  /**根据用户传入选中设置选中数据（如果当前table数据之后了没有就采用用户传入的数据） */
  setSelectedDatas() {
    let datas = this.inSelectedDatas.map(e => this.tableDatas.find(data => data[this.inUuid] == e[this.inUuid]) || e)
    datas.map(e => {
      /**多次翻页过滤已存在的选中避免重复添加 */
      if (!this.tableSelectedDatas.find(s => s[this.inUuid] == e[this.inUuid])) {
        this.tableSelectedDatas.push(e)
      }
    })
  }

  /**设置选中的唯一识别UUID数组 */
  setTableSelectedUuidsByDatas() {
    this.tableSelectedUuids = this.tableSelectedDatas.map(e => e[this.inUuid])
  }

  /**设置禁用的唯一识别UUID数组 */
  setTableDisableUuidsByDatas() {
    this.tableDisableUuids = this.inDisableDatas.map(e => e[this.inUuid])
  }

  /**获取表格数据（异步和同步） */
  getList() {
    this.superGetListBefor();
    this.inIfPage = this.searchItem.ifPage = this.inIfPage ?? this.searchItem.ifPage ?? true;
    if (this.inApiUrl) {
      if (this.inLoading) this.loadingFlag = true;
      this.getDatasByHttp()
    } else {
      if (!this.inAllDatas) return;
      if (this.inIfPage) {
        let page = this.page,
          pageRecord = page.pageRecord = page.pageRecord ?? this.inRecordOptions[0],
          cur = page.currentPage = page.currentPage ?? 1;
        this.tableDatas = this.inAllDatas.slice((cur - 1) * pageRecord, cur * pageRecord);
      } else {
        this.tableDatas = this.inAllDatas
      }
      this.getListAfter();
    }
  }

  /**获取网络数据 */
  getDatasByHttp() {
    this.http.post(this.inApiUrl, this.searchItem).subscribe((res: HttpResult) => {
      this.loadingFlag = false;
      if (res.rlt == 0) {
        this.page = res.datas;
        this.tableDatas = res.datas && res.datas.result || [];
      } else {
        this.tableDatas = []
      }
      this.getListAfter();
    })
  }

  /**获取表格数据后的处理 */
  getListAfter() {
    this.onCurDataChange.emit(this.tableDatas);
    this.tableSelectedDatas = this.tableSelectedDatas.map(e => this.tableDatas.find(data => data[this.inUuid] == e[this.inUuid]) || e);
    this.superGetListAfter();
  }

  superChanges(changes: SimpleChanges) { }
  superInitAfter() { }
  superGetListBefor() { }
  superGetListAfter() { };

  /**表头点击事件 */
  onCheckThead(flag, datas = this.tableDatas, thead = this.inItems) {
    let changeDatas = []
    datas.forEach((e) => { if (!this.getDataDisableStatus(e)) { this.onCheckedData(flag, e, changeDatas) } });
    this.onSelectChange.emit(new TableSelect(flag, changeDatas, this.tableSelectedDatas, this.tableSelectedUuids))
  }

  /**数据点击事件 */
  onCheckedData(flag, data, changeDatas: any[] = undefined) {
    if (flag) {
      if (this.tableSelectedUuids.includes(data[this.inUuid])) return;
      this.tableSelectedUuids.push(data[this.inUuid]);
      this.tableSelectedDatas.push(data);
    } else {
      this.tableSelectedUuids = this.tableSelectedUuids.filter(e => e != data[this.inUuid]);
      this.tableSelectedDatas = this.tableSelectedDatas.filter(e => e[this.inUuid] != data[this.inUuid]);
    }
    changeDatas && changeDatas.push(data);
    if (!changeDatas) {
      this.onSelectChange.emit(new TableSelect(flag, [data], this.tableSelectedDatas, this.tableSelectedUuids))
    }
  }

  /**翻页器改变（当前页，每页数据量） */
  onPageChange(page: PaginationPage) {
    let currentPage = page.currentPage, pageRecord = page.pageRecord;
    if (this.searchItem.currentPage == currentPage && this.searchItem.pageRecord == pageRecord) return;
    let flag = this.searchItem.pageRecord == pageRecord;
    Object.assign(this.searchItem, { currentPage, pageRecord });
    this.getList();
    if (!flag) {
      /**改变每页条数可能出现滚动条，需要重新计算宽度 */
      let $after = this.onCurDataChange.asObservable().subscribe(res => {
        this.setTableWidth();
        $after.unsubscribe();
      })
    }
  }

  /** 表头显示列有改变 */
  onChangeItemFilter() {
    this.setTableWidth();
  }

  //以下选框状态方案待优化
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