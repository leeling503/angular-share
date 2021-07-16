import { OverlayModule } from "@angular/cdk/overlay";
import { CdkPortal, Portal, PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareMapModule } from "share-libs";
import { ShareLibsModule } from "share-libs/share-libs.module";
import { exComponents } from ".";
import { ExRouteModule } from "./examples.routing";
@NgModule({
    declarations: [exComponents],
    imports: [ShareLibsModule, CommonModule, ShareMapModule, ExRouteModule, OverlayModule, PortalModule],
    exports: [exComponents]
})
export class ExamplesModule { }