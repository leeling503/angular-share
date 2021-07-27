import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareMapComponent } from "./share-map-base/share-map-base.component";

@NgModule({
    imports: [CommonModule],
    declarations: [ShareMapComponent],
    exports: [ShareMapComponent]
})
export class ShareMapModule { }