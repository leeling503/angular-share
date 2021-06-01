import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { COMPONENTS } from ".";
import { ExamplesModule } from "../examples/examples.module";
import { ReuseTabContextDirective } from "./layout-cache-ctr/reuse-tab-context.directive";
import { layoutRouterModule } from "./layout.routing";

@NgModule({
    declarations: [COMPONENTS, ReuseTabContextDirective],
    imports: [
        CommonModule,
        FormsModule,
        OverlayModule,
        PortalModule,
        layoutRouterModule,
    ]
})
export class LayoutModule { }