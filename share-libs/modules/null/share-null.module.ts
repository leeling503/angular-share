import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareNullComponent } from "./share-null.component";

/**无数据模块 */
@NgModule({
    declarations: [ShareNullComponent],
    imports: [CommonModule],
    exports: [ShareNullComponent]
})
export class ShareNullModule { }