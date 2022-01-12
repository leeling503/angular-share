import { ComponentPortal, } from '@angular/cdk/portal';
import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShareOverlayConfig, ShareOverlayPosition, ShareOverlayService } from 'share-libs/src/services/share-overlay.service';
import { ModalChange, ShareModalSelectItem, ShareModalSelectItemComponent } from '../../open-modals/modal-select-item/modal-select-item.component';
import { TableMultiHeadItem, TableItem } from '../share-table.model';
/**
 * 表头过滤组件
 */
@Component({
    selector: 'filter-head',
    templateUrl: './filter-table-head.component.html',
    styleUrls: ['./filter-table-head.component.less']
})
export class FilterTableHeadComponent implements OnInit {
    constructor(private shareOverlay: ShareOverlayService, private factory: ComponentFactoryResolver, private el: ElementRef) {
        this.native = this.el.nativeElement;
    }
    /** 输入表头数据 */
    @Input() inItems: TableItem[] | TableMultiHeadItem[] = [];
    /** 表格列的唯一key  单表头为key 多表头为_keyCode */
    @Input() inFilterKey: 'key' | '_keyCode' = 'key';
    /** 选项改变 true表示增加  false表示隐藏 */
    @Output() onChangeItemFilter: EventEmitter<ModalChange> = new EventEmitter();
    /**node节点 */
    native: HTMLElement;
    /**区别多表头和普通单表 */
    tableType: 'multi' | 'single' = 'single';
    /**计算得出的选项 */
    modalSelectItems: Array<ShareModalSelectItem> = [];
    ngOnChanges(changes: SimpleChanges): void { }
    ngOnInit(): void {
        if (this.inFilterKey == '_keyCode') {
            this.tableType = 'multi';
            this.modalSelectItems = this.getMultiSelectItems(<TableMultiHeadItem[]>this.inItems);
        } else {
            this.tableType = 'single';
            this.modalSelectItems = this.getSelectItems(<TableItem[]>this.inItems);
        }
        console.log(this.modalSelectItems)
    }

    /**设置多表头的过滤项 */
    getMultiSelectItems(items: TableMultiHeadItem[]): ShareModalSelectItem[] {
        let selectItems: ShareModalSelectItem[] = [];
        items.map(e => {
            let tableItems = e.heads;
            /**每个表头都生成一个选项框 */
            let selectItem = this.getSelectItems(tableItems)
            /**循环生成的选款对key一样的合并 */
            for (let i = 0, len = selectItem.length; i < len; i++) {
                const data = selectItem[i];
                /**从所有的选项中找到与当前key一样的选项 */
                let item = selectItems.find(item => item.key == data.key);
                /**没找到直接push*/
                if (item === undefined) {
                    selectItems.push(data)
                } else {
                    //只要有一个不许改变该列就都不许改变
                    item.canChange = item.canChange && data.canChange;
                    //有一个选中就选中
                    item._checked = item._checked || data._checked;
                    let value = item.value.split('/').includes(data.value) ? '' : data.value;
                    item.value = item.value + (value ? ('/' + value) : '');
                }
            }
        })
        return selectItems;
    }

    /**获得选项 */
    getSelectItems(items: TableItem[]): ShareModalSelectItem[] {
        let selectItems: ShareModalSelectItem[] = [];
        for (let i = 0, len = items.length; i < len; i++) {
            const e = items[i], key = e[this.inFilterKey];
            /**申明该列不在过滤框显示 */
            if (e.filterHid) continue;
            // let exist = selectItems.find(e => e.key === key);
            let item: ShareModalSelectItem = {}
            /**获得唯一标识符 */
            item.key = key;
            /**选项名*/
            item.value = e.title;
            /**显示的都选中*/
            item._checked = e.ifShow !== false;
            /**禁用不能改变的*/
            item.canChange = e.filterCan !== false;
            selectItems.push(item)
        }
        return selectItems;
    }

    /**打开弹出层 */
    onOpenOverlay() {
        let position = new ShareOverlayPosition(), config = new ShareOverlayConfig();
        config.width = null, config.height = null;
        position.type = 'ele';
        position.element = this.native.querySelector('.filter-table-head');
        position.withPositions = [{
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
        }]
        position.y = 3;
        position.x = -3;
        let overlay = this.shareOverlay.show(ShareModalSelectItemComponent, position, config);
        this.shareOverlay.instanceComponent(overlay, {
            inItems: this.modalSelectItems,
            inHasAll: true
        })
        overlay.component.onModalChangeItem.subscribe((res: ModalChange) => { this.filterItemChange(res) })
    }

    /**过滤项有所改变 */
    filterItemChange(item: ModalChange) {
        this.onChangeItemFilter.emit(item);
    }

}
