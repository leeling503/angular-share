import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MapBaseDirective } from "./map-base.directive";
import { MapComponent } from "./map-base/map-base.component";
import { MapHeatDirective } from "./map-heat.directive";
import { MapNetDirective } from "./map-net.directive";
import { MapTrackDirective } from "./map-track.directive";

@NgModule({
    imports: [CommonModule],
    declarations: [MapComponent, MapBaseDirective, MapNetDirective, MapTrackDirective, MapHeatDirective],
    exports: [MapComponent, MapBaseDirective, MapNetDirective, MapTrackDirective, MapHeatDirective]
})
export class ShareMapModule { }