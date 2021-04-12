import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { ShareBaseSearch } from "share-libs/src/models";
import { ShareBaseHttpService } from "share-libs/src/services";
import { TableComponent } from "../table/share-table.component";
import { TableMultiAllItems, TableMultiHeadItem, SharePage, TableItem, TableMultiItem, TableSelect } from "../share-table.model";

@Component({
    selector: 'share-table-multi-head',
    templateUrl: './table-multi-head.component.html',
    styleUrls: ['./table-multi-head.component.less']
})
export class TableMultiHeadComponent extends TableComponent implements OnInit {
    constructor(http: ShareBaseHttpService, el: ElementRef) {
        super(http, el);
    }
    /**表格对应数据value的表头的数据 */
    @Input() inAllItems: TableMultiAllItems = {}
    /**从数据中获取表头时的关键字 */
    @Input() inItemKey: string = "typeCode";
    /**html页面使用的数据(含表头和数据) */
    tableMultiItems: Array<TableMultiHeadItem> = [];
    searchItem: ShareBaseSearch = new ShareBaseSearch();
    pageRecordOptions: number[] = [15, 20, 30, 50];
    @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();

    onChanges(changes: SimpleChanges) { }
    superInit() { }
    superGetListAfter() { this.getTableMultiItems(); };
    ngAfterViewInit(): void { }
    /**获取数据后设置表头 */
    getTableMultiItems() {
        let datas = this.tableDatas, items = this.inAllItems, key = this.inItemKey, tableMultiItems: Array<TableMultiHeadItem> = [],
            values = [], valueData = {}, heads = [];
        datas.forEach(e => {
            let value = e[key];//该条数据使用的表头的key值
            let datas = valueData[value] = valueData[value] || [];//同一表头的数据归为一组Array
            datas.push(e);
            if (!values.includes(value)) {//判断该表头是否已经存储
                values.push(value);
                let item = Object.assign([], items[value]); //要使用的表头
                heads.push(item);
                tableMultiItems.push({
                    heads: item,
                    datas
                })
            }
        })
        this.tableMultiItems = tableMultiItems;
        this.setMultiItems(heads);
        this.setDataSerial();
        this.set_ifShow();
    }

    /**数据排序 */
    setDataSerial() {
        let index = (this.page.currentPage - 1) * this.page.pageRecord + 1;
        this.tableMultiItems.forEach(e => {
            e.datas.forEach(e => {
                e.serial = index++;
            })
        })
    }

    setMultiItems(heads: Array<TableMultiItem[]>) {
        let len = heads.length;
        if (len > 1) {
            this.configHeadItems()
        }
    }

    configHeadItems() {
        let heads: Array<TableMultiItem[]> = [];
        /**表头最多的放在第一行 */
        this.tableMultiItems.sort((a, b) => { return (b.heads.length) - (a.heads.length); });
        this.tableMultiItems.forEach(e => heads.push(e.heads));
        /**交换顺序用_keyCode */
        heads.forEach(e => {
            e.forEach(item => {
                item._keyCode = item.keyCode;
            })
        })
        /**计算表头最长有多少 */
        let maxLength = heads[0].length;
        /**调整表头顺序，以第上一个为准 */
        for (let i = 0, len = heads.length - 1; i < len; i++) {
            let cur = heads[i], next = heads[i + 1];
            let allCode = cur.map(e => e._keyCode);
            for (let j = 0; j < maxLength; j++) {
                let curCode = cur[j]._keyCode;
                let index = next.findIndex((e, i) => e._keyCode == curCode && i >= j);
                //下一个表中不存在该keycode
                if (index < 0) {
                    /** 找到下个表头数组剩余的表头，且在上一个表中不存在的code */
                    index = next.findIndex((e, i) => !allCode.includes(e._keyCode) && i >= j);
                    if (index < 0) {
                        next.push({ title: '', keyCode: curCode, _keyCode: curCode });
                        index = next.length - 1;
                    } else {
                        /**改写_keyCode以便下一个 */
                        next[index]._keyCode = curCode;
                    }
                }
                this.swapHeadItem(next, index, j)
            }
        }
    }

    swapHeadItem(datas: TableMultiItem[], index, j) {
        let item = datas[index];
        datas[index] = datas[j];
        datas[j] = item;
    }

    /**设置宽度 */
    set_TableWidth(heads?: Array<TableMultiItem[]>) {
        if (!heads) return;
        let allWith = 0, head = heads[0];
        /**设置宽度为同列最大的宽度 */
        for (let j = 0, l = head.length; j < l; j++) {
            let _maxWidth = 0, flag = false, _styckyLeft;
            for (let i = 0, len = heads.length; i < len && !flag; i++) {
                let item = heads[i][j];
                let width = item.width || item.widthMin || 60;
                if (!!item.styckyLeft) {
                    /**设置了固定属性 */
                    flag = true;
                    _styckyLeft = item.styckyLeft;
                    _maxWidth = width;
                } else {
                    _maxWidth = _maxWidth > width ? _maxWidth : width;
                }
            }
            for (let i = 0, len = heads.length; i < len; i++) {
                heads[i][j]._width = _maxWidth;
                if (flag) {
                    /**设置了固定属性 */
                    heads[i][j]._styckyLeft = _styckyLeft;
                }
            }
            allWith += _maxWidth;
        }
        let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
        if (tableWidth > allWith) {
            let tableMaxHeight = this.nativeEl.querySelector('.table-part').clientHeight;
            let tableHeight = this.nativeEl.querySelector('table').clientHeight;
            /**设置的宽度小于实际宽度 */
            let allWith = 0, computeWidth = 0, len = 0;
            head.forEach(e => {
                if (e._ifShow !== false) {
                    allWith += e._width;
                    len++;
                    if (!e.styckyLeft) {
                        computeWidth += e._width
                    }
                }
            })
            /**-边框宽度 */
            if (this.inClassNames.includes('border')) {
                tableWidth -= (len + 2)
            }
            /**-侧边滚动条宽度 */
            if (tableHeight > tableMaxHeight) {
                tableWidth -= 6
            }
            // Promise.resolve().then(res => {
                let extraWidth = tableWidth;
                for (let j = 0, l = head.length - 1; j <= l; j++) {
                    let item = head[j], eWidth = head[j]._width, width;
                    if (item._ifShow === false) {
                        for (let i = 0, len = heads.length; i < len; i++) {
                            let item = heads[i][j];
                            item._width = 0;
                        }
                    } else {
                        if (j === l) {
                            width = extraWidth;
                        } else if (item.styckyLeft) {
                            width = eWidth;
                        } else {
                            width = (extraWidth * eWidth / computeWidth) | 0;
                            computeWidth -= eWidth;
                        }
                        for (let i = 0, len = heads.length; i < len; i++) {
                            let item = heads[i][j];
                            item._width = width;
                        }
                        extraWidth -= width;
                    }
                }
            // })
        }
    }

    /**多表头整列是否隐藏并计算宽度 */
    set_ifShow() {
        let heads: TableMultiItem[][] = [];
        this.tableMultiItems.forEach(e => heads.push(e.heads));
        for (let i = 0, len = heads[0].length; i < len; i++) {
            let ifShow = false;
            for (let j = 0, len = heads.length; j < len && !ifShow; j++) {
                ifShow = heads[j][i].ifShow !== false;
            }
            for (let j = 0, len = heads.length; j < len; j++) {
                heads[j][i]._ifShow = ifShow;
            }
        }
        this.set_TableWidth(heads)
    }

    onChangeItemFilter() {
        this.set_ifShow();
    }
}

