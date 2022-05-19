import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShareInputComponent } from "./share-input/share-input.component";
import { ShareInputLnglatComponent } from "./share-input-lnglat/share-input-lnglat.component";

@NgModule({
    declarations: [
        ShareInputComponent,
        ShareInputLnglatComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [ShareInputComponent,
        ShareInputLnglatComponent]
})
export class ShareInputModule { }