import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareCheckboxModule } from "../checkbox/share-checkbox.module";
import { ShareModalSelectItemComponent } from "./modal-select-item/modal-select-item.component";
let components = [
    ShareModalSelectItemComponent
]

@NgModule({
    declarations: [...components],
    imports: [CommonModule, ShareCheckboxModule],
    exports: [...components]
})
export class ShareOpenModalsModule { }