import { Component, ElementRef } from "@angular/core";
import { UtilArrayCopy } from "share-libs/src/utils";
import { ShareSelect } from "../select/select.component";
/**
 * 可以添加选项的一行三列选择面板
 */
@Component({
    selector: 'share-select-add',
    templateUrl: './share-select-add.component.html',
    styleUrls: ['./share-select-add.component.less']
})
export class ShareSelectAdd extends ShareSelect {
    constructor(private el: ElementRef) {
        super();
        this.nativeEl = this.el.nativeElement;
    }

    /**经过用户确认的关闭选框 */
    onCheckSureChange($event: boolean) {
        this.openOptions = !1;
        if ($event === false) {
            this.checkOptions = UtilArrayCopy(this.emitCheckOptions);
        }
        this._emitModelOption();
    }
}