import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ShareNullComponent } from "./share-null.component";

@NgModule({
    declarations: [ShareNullComponent],
    imports: [CommonModule],
    exports: [ShareNullComponent]
})
export class ShareNullModule { }