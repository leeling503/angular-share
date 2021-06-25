import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";
import { NgModule } from "@angular/core";
import { MapBaseDirective } from "share-libs/src/directives/leaflet-map/map-base.directive";
import { ShareMapComponent } from "./share-map.component";

@NgModule({
    imports: [CommonModule],
    declarations: [ShareMapComponent, MapBaseDirective],
    exports: [ShareMapComponent, MapBaseDirective]
})
export class ShareMapModule { }