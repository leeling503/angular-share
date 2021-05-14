import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ShareLibsModule } from "share-libs/share-libs.module";
import { exComponents } from ".";
@NgModule({
    declarations: [exComponents],
    imports: [ShareLibsModule, CommonModule, RouterModule],
    exports: [exComponents]
})
export class ExamplesModule { }