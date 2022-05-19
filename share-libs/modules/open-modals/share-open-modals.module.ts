import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareCheckModule } from "../check/share-check.module";
import { ShareModalSelectItemComponent } from "./modal-select-item/modal-select-item.component";
let components = [
    ShareModalSelectItemComponent,
]
/**
 * 小弹窗
 */
@NgModule({
    declarations: [...components],
    imports: [CommonModule, ShareCheckModule],
    exports: [...components]
})
export class ShareOpenModalsModule { }