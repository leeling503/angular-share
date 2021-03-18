import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'share-modal-select-item',
    templateUrl: './modal-select-item.component.html',
    styleUrls: ['./modal-select-item.component.less']
})
export class ShareModalSelectItemComponent {
    @Input() propItems: ModalItem[] = [
        { value: '123', key: "11" },
        { value: '122', key: "22" },
    ];
    @Input() propHasAll: boolean = true;//是否有全选
    @Output() emitModalChangeItem: EventEmitter<ModalChange> = new EventEmitter();
    uuid: string = "key";
    checkedItemUuids: string[] = [];
    checkedItems: ModalItem[] = [];

    ngOnInit(): void {
        this.checkedItems = this.propItems.map((e) => { if (e.ifChecked) return e; }).filter(e => e !== undefined);
        this.checkedItemUuids = this.checkedItems.map((e) => e[this.uuid]);
    }

    acceptCheck(flag, item: ModalItem, changeItems?: ModalItem[]) {
        if (flag) {
            item.ifChecked = flag;
            this.checkedItems.push(item);
            this.checkedItemUuids.push(item[this.uuid]);
            changeItems && changeItems.push(item);
        } else {
            item.ifChecked = flag;
            this.checkedItems = this.checkedItems.filter(e => e[this.uuid] !== item[this.uuid])
            this.checkedItemUuids = this.checkedItems.map((e) => e[this.uuid]);
        }
        if (!changeItems) {
            this.emitModalChangeItem.emit({ flag, changeItems: [item], selectItems: this.checkedItems })
        }
    }

    acceptCheckAll(flag) {
        let changeItems = !flag && this.checkedItems || [];
        this.propItems.forEach(e => { this.acceptCheck(flag, e, changeItems) });
        this.emitModalChangeItem.emit({ flag, changeItems, selectItems: this.checkedItems })
    }

    get allCheckStatus(): boolean {
        let flag = this.propItems.every(e => this.checkedItemUuids.includes(e[this.uuid]));
        return flag;
    }

    get allMixStatus(): boolean {
        let flag = this.propItems.some(e => this.checkedItemUuids.includes(e[this.uuid]));
        return flag;
    }
}

class ModalItem {
    value: string;
    key: string;
    ifChecked?: boolean;
}

class ModalChange {
    flag: boolean; //选中
    changeItems: ModalItem[]; //改变的item
    selectItems: ModalItem[]; //选中的Item
}