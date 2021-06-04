import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FileUploadModule } from "ng2-file-upload";
import { ShareFileUploadComponent } from "./share-file-upload/share-file-upload.component";

@NgModule({
    imports: [CommonModule, FileUploadModule],
    declarations: [ShareFileUploadComponent],
    exports: [ShareFileUploadComponent]
})
export class ShareFileUploadModule { }