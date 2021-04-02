import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";

@Component({
    selector: 'share-modal-select-item',
    templateUrl: './modal-select-item.component.html',
    styleUrls: ['./modal-select-item.component.less']
})
export class ShareModalSelectItemComponent {
    @Input() inItems: ShareModalSelectItem[] = [];
    @Input() inCheckKey: string = "_checked";
    @Input() inHasAll: boolean = true;//是否有全选
    @Output() onModalChangeItem: EventEmitter<ModalChange> = new EventEmitter();
    checkedItems: ShareModalSelectItem[] = [];
    allChecked: boolean = false;
    allMixStatus: boolean = false;
    allSelectItem: ShareModalSelectItem = { value: '全选/反选', key: '_all', _checked: false, _mix: false }
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes.inCheckKey || changes.inItems) {
            this.setCheckedItem()
        }
    }

    ngOnInit(): void {
        this.setCheckedItem()
    }

    setCheckedItem() {
        this.checkedItems = this.inItems.map((e) => {
            if (e[this.inCheckKey]) { e._checked = true } else { e._checked = false }
            return e
        }).filter(e => e._checked);
        this.setAllCheckStatus();
        this.setAllMixStatus();
    }

    acceptCheck(flag: boolean, item: ShareModalSelectItem, changeItems?: ShareModalSelectItem[]) {
        if (!item.canChange) { return }
        if (flag) {
            if (item._checked) { return }
            item._checked = flag;
            this.checkedItems.push(item)
        } else {
            item._checked = flag;
            this.checkedItems = this.checkedItems.filter(e => e._checked)
        }
        this.setAllCheckStatus();
        this.setAllMixStatus();
        changeItems && changeItems.push(item);
        if (!changeItems) {
            this.onModalChangeItem.emit({ flag, changeItems: [item], selectItems: this.checkedItems })
        }
    }

    acceptCheckAll(flag: boolean) {
        let changeItems = [];
        this.inItems.forEach(e => { this.acceptCheck(flag, e, changeItems) });
        this.allSelectItem._checked = flag;
        this.onModalChangeItem.emit({ flag, changeItems, selectItems: this.checkedItems })
    }

    setAllCheckStatus() {
        this.allSelectItem._checked = this.inItems.every(e => e._checked);
    }

    setAllMixStatus() {
        this.allSelectItem._mix = this.inItems.some(e => e._checked);
    }

}

export class ShareModalSelectItem {
    value?: string;
    key?: string;
    /** 选中 */
    _checked?: boolean;
    /** 头部mix状态 */
    _mix?: boolean;
    /**能否改变选中状态 */
    canChange?: boolean;
}

export class ModalChange {
    flag: boolean; //选中
    changeItems: ShareModalSelectItem[]; //改变的item
    selectItems: ShareModalSelectItem[]; //选中的Item
}