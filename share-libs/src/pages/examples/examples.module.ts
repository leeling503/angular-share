import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareMapModule } from "share-libs";
import { ShareLibsModule } from "share-libs/share-libs.module";
import { exComponents } from ".";
import { ExRouteModule } from "./examples.routing";
@NgModule({
    declarations: [exComponents],
    imports: [ShareLibsModule, CommonModule, ShareMapModule, ExRouteModule],
    exports: [exComponents]
})
export class ExamplesModule { }