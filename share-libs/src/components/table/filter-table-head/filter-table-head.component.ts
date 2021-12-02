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
    modalSelectItems: Array<ShareModalSelectItem> = [];
    openFlag: boolean = false;
    native: HTMLElement;
    /** 输入表头数据 */
    @Input() inItems: TableItem[] | TableMultiHeadItem[] = [];
    @Input() inFilterKey: 'key' | '_keyCode' = 'key';
    /** 表格列的唯一key  单表头为key 多表头为keyCode */
    @Output() onChangeItemFilter: EventEmitter<any> = new EventEmitter();
    tableType: 'multi' | 'single' = 'single';
    ngOnChanges(changes: SimpleChanges): void { }

    ngOnInit(): void {
        if (this.inFilterKey == '_keyCode') {
            this.tableType = 'multi';
            this.modalSelectItems = this.getMultiSelectItems(<TableMultiHeadItem[]>this.inItems);
        } else {
            this.tableType = 'single';
            this.modalSelectItems = this.getSelectItems(<TableItem[]>this.inItems);
        }
    }

    /**设置多表头的过滤项 */
    getMultiSelectItems(items: TableMultiHeadItem[]): ShareModalSelectItem[] {
        let selectItems: ShareModalSelectItem[] = [];
        items.map(e => {
            let tableItems = e.heads;
            let selectItem = this.getSelectItems(tableItems)
            for (let i = 0, len = selectItem.length; i < len; i++) {
                const data = selectItem[i];
                let item = selectItems.find(item => item.key == data.key);
                if (item === undefined) {
                    selectItems.push(data)
                } else {
                    item.canChange = item.canChange && data.canChange;//只要有一个不许改变该列就都不许改变
                    item._checked = item._checked || data._checked;
                    let value = item.value.split('/').includes(data.value) ? '' : data.value;
                    item.value = item.value + (value ? ('/' + value) : '');
                }
            }
        })
        return selectItems;
    }

    getSelectItems(items: TableItem[]): ShareModalSelectItem[] {
        let modalSelectItems: ShareModalSelectItem[] = [];
        for (let i = 0, len = items.length; i < len; i++) {
            const e = items[i];
            if (e.hidFilter) continue;
            let item: ShareModalSelectItem = {}
            item.key = e[this.inFilterKey];
            item.value = e.title;
            item._checked = e.ifShow !== false;
            item.canChange = e.canFilter !== false;
            modalSelectItems.push(item)
        }
        return modalSelectItems;
    }

    /**过滤项有所改变 */
    filterItemChange(item: ModalChange) {
        let changeItems = item.changeItems;
        for (let i = 0, len = changeItems.length; i < len; i++) {
            const _item = changeItems[i];
            if (this.tableType == 'single') {
                this.inItems.forEach(item => {
                    if (item[this.inFilterKey] == _item.key) {
                        item.ifShow = _item._checked;
                    }
                })
            } else {
                (<TableMultiHeadItem[]>this.inItems).forEach(e => {
                    e.heads.forEach(head => {
                        if (head[this.inFilterKey] == _item.key) {
                            head.ifShow = _item._checked;
                        }
                    })
                })
            }
        }
        this.onChangeItemFilter.emit()
    }

    /**打开弹出层 */
    openOverlay() {
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
        let overlay = this.shareOverlay.show(ShareModalSelectItemComponent, position, config);
        this.shareOverlay.instanceComponent(overlay, {
            inItems: this.modalSelectItems,
            inHasAll: true
        })
        overlay.component.onModalChangeItem.subscribe((res: ModalChange) => { this.filterItemChange(res) })
    }


}
