import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShareInputComponent } from "./share-input.component";

@NgModule({
    declarations: [
        ShareInputComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [ShareInputComponent]
})
export class ShareInputModule { }