import { ComponentPortal, } from '@angular/cdk/portal';
import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ShareOverlayPosition, ShareOverlayService } from 'share-libs/src/services/share-overlay.service';
import { ModalChange, ShareModalSelectItem, ShareModalSelectItemComponent } from '../../open-modals/modal-select-item/modal-select-item.component';
import { MultiHeadItem, TableItem } from '../share-table.model';

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
    @Input() inItems: TableItem[] | MultiHeadItem[] = [];
    @Input() inFilterKey: 'key' | 'keyCode' = 'key';
    /** 表格列的唯一key  单表头为key 多表头为keyCode */
    @Output() onChangeItemFilter: EventEmitter<any> = new EventEmitter();
    tableType: 'multi' | 'single' = 'single';
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes.inItems) {

        }
    }
    ngOnInit(): void {
        if (this.inFilterKey == 'keyCode') {
            this.tableType = 'multi';
            this.setMultiSelectItems(<MultiHeadItem[]>this.inItems);
        } else {
            this.tableType = 'single';
            this.modalSelectItems = this.getSelectItems(<TableItem[]>this.inItems);
        }
    }

    setMultiSelectItems(items: MultiHeadItem[]) {
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
                    let value = item.value == data.value ? '' : data.value;
                    item.value = item.value + (value ? ('/' + value) : '');
                }
            }
        })
        this.modalSelectItems = selectItems;
    }

    getSelectItems(items: TableItem[]): ShareModalSelectItem[] {
        let modalSelectItems = items.map(e => {
            let item: ShareModalSelectItem = {}
            item.key = e[this.inFilterKey];
            item.value = e.title;
            item._checked = e.ifShow !== false;
            item.canChange = e.canFilter !== false;
            return item
        })
        return modalSelectItems;
    }

    openOverlay() {
        let modalSelect = new ComponentPortal(ShareModalSelectItemComponent);
        let position = new ShareOverlayPosition();
        position.type = 'ele';
        position.element = this.native.querySelector('.filter-table-head');
        let overlay = this.shareOverlay.showComponent(modalSelect, position);
        this.shareOverlay.instanceComponent(overlay, {
            inItems: this.modalSelectItems,
            inHasAll: true
        })
        overlay.component.onModalChangeItem.subscribe((res: ModalChange) => {
            let changeItems = res.changeItems;
            for (let i = 0, len = changeItems.length; i < len; i++) {
                const _item = changeItems[i];
                if (this.tableType == 'single') {
                    this.inItems.forEach(item => {
                        if (item[this.inFilterKey] == _item.key) {
                            item.ifShow = _item._checked;
                        }
                    })
                } else {
                    (<MultiHeadItem[]>this.inItems).forEach(e => {
                        e.heads.forEach(head => {
                            if (head[this.inFilterKey] == _item.key) {
                                head.ifShow = _item._checked;
                            }
                        })
                    })
                }
            }
            this.onChangeItemFilter.emit()
        })
    }
}
