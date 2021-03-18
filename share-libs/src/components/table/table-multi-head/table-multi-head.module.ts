import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareCheckboxModule } from "../../checkbox/share-checkbox.module";
import { SharePaginationModule } from "../../pagination/share-pagination.module";
import { TableMultiHeadComponent } from "./table-multi-head.component";

@NgModule({
    imports: [CommonModule,
        ShareCheckboxModule,
        SharePaginationModule],
    declarations: [TableMultiHeadComponent],
    exports: [TableMultiHeadComponent]
})
export class ShareTableMultiHeadModule { }