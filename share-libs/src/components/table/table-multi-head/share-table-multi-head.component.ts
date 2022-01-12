import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import { HttpSearch } from "share-libs/src/models";
import { TableComponent } from "../table/share-table.component";
import { TableMultiAllItems, TableMultiHeadItem, TableMultiItem, TableSelect } from "../share-table.model";
import { HttpBaseService } from "share-libs/src/services/http-base.service";
import { ModalChange } from "../../open-modals/modal-select-item/modal-select-item.component";
/**
 * 多表头表格组件
 */
@Component({
    selector: 'share-table-multi-head',
    templateUrl: './share-table-multi-head.component.html',
    styleUrls: ['../table/share-table.component.less', './share-table-multi-head.component.less']
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
    superGetListAfter() {
        this.setTableMultiItems();
        this.setIfShow();
    };

    /**根据获取的数据设置表头 */
    private setTableMultiItems() {
        let datas = this.tableDatas, headKey = this.inHeadKey, tableMultiItems: TableMultiHeadItem[] = [],
            values = [], valueData = {}, heads = [];
        this.tableMultiItems = tableMultiItems;
        datas.forEach(e => {
            /*该条数据使用的表头的key值*/
            let value = e[headKey];
            /*将同一表头(headKey相同)的数据归为一组Array*/
            let datas = valueData[value] = valueData[value] || [];
            datas.push(e);
            /*values仅仅用于判断该表头和数据是否已经生成并存储到tableMultiItems */
            if (!values.includes(value)) {
                /*该表头没有存储则将表头和数据存储 */
                values.push(value);
                /**该value对应的表头信息 */
                let item: TableMultiItem[] = Object.assign([], this.inAllItems[value]); //要使用的表头
                /**将要显示的表头信息存储，方便后续处理*/
                heads.push(item);
                /**表头和数据存储到tableMultiItems*/
                tableMultiItems.push({ heads: item, datas })
            }
        })
        /**无数据时表头处理(任取一表头显示) */
        if (tableMultiItems.length <= 0) {
            for (const key in this.inAllItems) {
                tableMultiItems.push({ heads: this.inAllItems[key], datas: [] });
                break;
            }
        }
        /**判断为多表头时需要对多表头进行配置 */
        heads.length > 1 && this.setHeadItems();
        /**对数据进行列序 */
        this.setDataSerial();
    }

    /**对多表头进行配置 */
    private setHeadItems() {
        let heads: Array<TableMultiItem[]> = [];
        /**表头最多的放在第一行（避免第一个表头出现空白栏） */
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
            /**当前表头和下一个表头 */
            let cur = heads[i], next = heads[i + 1];
            /**当前表头中的所有keyCode */
            let allCode = cur.map(e => e._keyCode);
            for (let j = 0; j < maxLength; j++) {
                /**当前表头的第j列数据的keyCode */
                let curCode = cur[j]._keyCode;
                /**在下一个表头中找到相同的keyCode，并且该列不属于调整过的列 */
                let index = next.findIndex((e, i) => e._keyCode == curCode && i >= j);
                //下一个表中不存在该keycode
                if (index < 0) {
                    /** 在下个表头数组剩余的表头（i >= j）且在当前表头中不存在的code */
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
                /**交换表头位置(将下一个表头中匹配到的或生成的表头项移动到第j位)*/
                this.swapHeadItem(next, index, j)
            }
        }
    }

    /**交换表头位置*/
    private swapHeadItem(items: TableMultiItem[], index, j) {
        let item = items[index];
        items[index] = items[j];
        items[j] = item;
    }

    /**为数据设置序号 */
    private setDataSerial() {
        let serial = this.inIfPage ? (this.page.currentPage - 1) * this.page.pageRecord + 1 : 1;
        this.tableMultiItems.forEach(e => {
            e.datas.forEach(e => {
                e._serial = serial++;
            })
        })
    }

    /**设置表格的宽度  flag表示是否增加列表项*/
    setTableWidth() {
        let heads: TableMultiItem[][] = this.tableMultiItems.map(e => e.heads);
        if (!heads) return;
        this.timeoutCtr.next()
        /**使用Promise翻页得到的页面节点数据依旧是旧页面的*/
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
        let tableWidth = this.tableWidthMax;
        /**表的最高高度 */
        let tableMaxHeight = this.tableHeightMax;
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
    }

    /**多表头整列是否隐藏并计算宽度 (flag是否及时更新) */
    private setIfShow() {
        let heads: TableMultiItem[][] = this.tableMultiItems.map(e => e.heads);
        /**表头数量 */
        let headsLen = heads.length;
        for (let i = 0, len = heads[0].length; i < len; i++) {
            /**对表头设置显隐 */
            let ifShow = false;
            for (let j = 0, len = headsLen; j < len && !ifShow; j++) {
                /**又一个设置为显示那么都显示？*/
                ifShow = heads[j][i].ifShow !== false;
            }
            for (let j = 0, len = headsLen; j < len; j++) {
                heads[j][i]._ifShow = ifShow;
            }
        }
        this.setTableWidth()
    }

    onChangeItemFilter(item: ModalChange) {
        let changeItems = item.changeItems;
        for (let i = 0, len = changeItems.length; i < len; i++) {
            const _item = changeItems[i];
            (<TableMultiHeadItem[]>this.tableMultiItems).forEach(e => {
                e.heads.forEach(head => {
                    if (head._keyCode == _item.key) {
                        head.ifShow = _item._checked;
                    }
                })
            })
        }
        this.setIfShow();
    }
}

