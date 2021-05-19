import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ExamplesModule } from "share-libs/src/examples/examples.module";
import { RouteReuseModule } from "share-libs/src/services/route-reuse/route-reuse.module";
import { COMPONENTS } from ".";
import { ReuseTabContextDirective } from "./layout-cache-ctr/reuse-tab-context.directive";
import { LayoutMenuServer } from "./layout-menu.service";
import { layoutRouterModule } from "./layout.routing";

@NgModule({
    declarations: [COMPONENTS , ReuseTabContextDirective],
    imports: [
        CommonModule,
        FormsModule,
        OverlayModule,
        PortalModule,
        RouterModule,
        layoutRouterModule,
        ExamplesModule
    ],
})
export class LayoutModule { }