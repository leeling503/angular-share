import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { HttpSearch } from "share-libs/src/models";
import { TableComponent } from "../table/share-table.component";
import { TableMultiAllItems, TableMultiHeadItem, TableMultiItem, TableSelect } from "../share-table.model";
import { HttpBaseService } from "share-libs/src/services/http-base.service";

@Component({
    selector: 'share-table-multi-head',
    templateUrl: './table-multi-head.component.html',
    styleUrls: ['./table-multi-head.component.less']
})
export class TableMultiHeadComponent extends TableComponent implements OnInit {
    constructor(http_: HttpBaseService, el: ElementRef) {
        super(http_, el);
    }
    /**表格对应数据value的表头的数据 */
    @Input() inAllItems: TableMultiAllItems = {}
    /**从数据中获取表头时的关键字 */
    @Input() inHeadKey: string = "typeCode";
    /**html页面使用的数据(含表头和数据) */
    tableMultiItems: Array<TableMultiHeadItem> = [];
    searchItem: HttpSearch = new HttpSearch();
    @Output() onSelectChange: EventEmitter<TableSelect> = new EventEmitter();
    ifYScorll: boolean = false;

    onChanges(changes: SimpleChanges) { }
    superInit() { }
    /**翻页，调整单页数据量以及初始加载数据都会调用 */
    superGetListAfter() { this.setTableMultiItems(); };
    /**重写父类方法  防止重复计算 */
    ngAfterViewInit(): void { }

    /**获取数据后设置表头 */
    private setTableMultiItems() {
        let datas = this.tableDatas, key = this.inHeadKey, tableMultiItems: TableMultiHeadItem[] = [],
            values = [], valueData = {}, heads = [];
        datas.forEach(e => {
            /*该条数据使用的表头的key值*/
            let value = e[key];
            /*同一表头(key)的数据归为一组Array*/
            let datas = valueData[value] = valueData[value] || [];
            datas.push(e);
            /*判断该表头是否已经存储 */
            if (!values.includes(value)) {
                values.push(value);
                let item: TableMultiItem[] = Object.assign([], this.inAllItems[value]); //要使用的表头
                heads.push(item);
                tableMultiItems.push({ heads: item, datas })
            }
        })
        this.tableMultiItems = tableMultiItems;
        /**无数据时表头处理 */
        if (this.tableMultiItems.length <= 0) {
            for (const key in this.inAllItems) {
                heads = this.inAllItems[key];
                break;
            }
            this.tableMultiItems = [{ heads, datas: [] }]
        }
        /**判断为多表头时需要对多表头进行配置 */
        heads.length > 1 && this.set_HeadItems();
        this.setDataSerial();
        this.setIfShow();
    }

    /**为数据设置序号 */
    private setDataSerial() {
        let index = this.inIfPage ? (this.page.currentPage - 1) * this.page.pageRecord + 1 : 1;
        this.tableMultiItems.forEach(e => {
            e.datas.forEach(e => {
                e.serial = index++;
            })
        })
    }

    /**对多表头进行配置 */
    private set_HeadItems() {
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
                    /**没有便创建个空表头 */
                    if (index < 0) {
                        next.push({ title: '', keyCode: curCode, _keyCode: curCode });
                        index = next.length - 1;
                    } else {
                        /**改写_keyCode以便下一个 */
                        next[index]._keyCode = curCode;
                    }
                }
                /**交换表头位置*/
                this.swapHeadItem(next, index, j)
            }
        }
    }

    /**交换表头位置*/
    private swapHeadItem(datas: TableMultiItem[], index, j) {
        let item = datas[index];
        datas[index] = datas[j];
        datas[j] = item;
    }

    /**设置表格的宽度  flag表示是否增加列表项*/
    setTableWidth(heads?: Array<TableMultiItem[]>) {
        if (!heads) return;
        /**使用Promise翻页得到的页面节点数据依旧是旧页面的*/
        Promise.resolve().then(() => {
            let allWith = 0, head = heads[0];
            /**先设置宽度_width为同列最大的宽度(设置了styckyLeft的优先级最高) */
            for (let j = 0, l = head.length; j < l; j++) {
                let _width = 0, flag = false, _styckyLeft;
                for (let i = 0, len = heads.length; i < len && !flag; i++) {
                    let item = heads[i][j], width = item.widthFix || item.width || item.widthMin || 60;
                    width = width >= 60 ? width : 60;
                    /**设置了固定属性 */
                    if (!!item.styckyLeft) {
                        _styckyLeft = item.styckyLeft;
                        _width = width;
                        break;
                    } else {
                        _width = _width > width ? _width : width;
                    }
                }
                for (let i = 0, len = heads.length; i < len; i++) {
                    heads[i][j]._width = _width;
                    heads[i][j]._styckyLeft = _styckyLeft;
                }
                allWith += _width;
            }
            /**整个表宽 */
            let tableWidth = this.nativeEl.querySelector('.share-table').clientWidth;
            /**表的最高高度 */
            let tableMaxHeight = this.nativeEl.querySelector('.table-part').clientHeight;
            /**表的实际高度 */
            let tableHeight = this.nativeEl.querySelector('table').clientHeight;
            if (tableWidth > allWith) {
                /**设置的宽度小于实际宽度 */
                let computeWidth = 0;
                head.forEach(e => {
                    if (e._ifShow !== false) {
                        computeWidth += e._width;
                    }
                })
                /** -边框宽度 box-sizing:border-box  */
                // if (this.inClassNames.includes('border')) tableWidth -= 1;
                /**出现侧边滚动条宽度 */
                if (tableHeight > tableMaxHeight) tableWidth -= 6;
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
                        } else if (item.styckyLeft || item._styckyLeft) {
                            width = eWidth;
                        } else {
                            width = (extraWidth * eWidth / computeWidth) | 0;
                        }
                        for (let i = 0, len = heads.length; i < len; i++) {
                            let item = heads[i][j];
                            item._width = width;
                        }
                        computeWidth -= eWidth;
                        extraWidth -= width;
                    }
                }
            }
            this.tableWidth = head.map(e => e._width).reduce((a, b) => a + b);
        })
    }

    /**多表头整列是否隐藏并计算宽度 (flag是否及时更新) */
    private setIfShow(flag: boolean = false) {
        let heads: TableMultiItem[][] = [];
        this.tableMultiItems.forEach(e => heads.push(e.heads));
        for (let i = 0, len = heads[0].length; i < len; i++) {
            /**对表头设置显影 */
            let ifShow = false;
            for (let j = 0, len = heads.length; j < len && !ifShow; j++) {
                ifShow = heads[j][i].ifShow !== false;
            }
            for (let j = 0, len = heads.length; j < len; j++) {
                heads[j][i]._ifShow = ifShow;
            }
        }
        // if (flag) {
            Promise.resolve().then(() => { this.setTableWidth(heads) })
        // } else {
        //     setTimeout(() => { this.setTableWidth(heads) }, 20);
        // }
    }

    onChangeItemFilter(flag: boolean) {
        this.setIfShow(true);
    }
}

