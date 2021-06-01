import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareLibsModule } from "share-libs/share-libs.module";
import { exComponents } from ".";
import { ExRouteModule } from "./examples.routing";
@NgModule({
    declarations: [exComponents],
    imports: [ShareLibsModule, CommonModule, ExRouteModule],
    exports: [exComponents]
})
export class ExamplesModule { }