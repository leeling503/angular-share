import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareFormComponent } from "./share-form.component";

@NgModule({
    declarations: [ShareFormComponent],
    imports: [CommonModule],
    exports: [ShareFormComponent]
})
export class ShareFormModule { }