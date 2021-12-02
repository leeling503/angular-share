import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShareInputComponent } from "./share-input.component";
import { ShareLnglatInputComponent } from "./share-lnglat-input/share-lnglat-input.component";

@NgModule({
    declarations: [
        ShareInputComponent,
        ShareLnglatInputComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [ShareInputComponent,
        ShareLnglatInputComponent]
})
export class ShareInputModule { }