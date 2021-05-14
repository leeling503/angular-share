import { Overlay, OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ExamplesModule } from "share-libs/src/examples/examples.module";
import { COMPONENTS } from ".";
import { layoutRouterModule } from "./layout.routing";

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        CommonModule,
        RouterModule,
        layoutRouterModule,
        ExamplesModule
    ]
})
export class LayoutModule { }