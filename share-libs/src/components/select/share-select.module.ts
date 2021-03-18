import { CdkPortal } from '@angular/cdk/portal';
import { OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin, } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareSelectComponent } from './share-select.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule],
    declarations: [ShareSelectComponent],
    providers: [],
    exports: [ShareSelectComponent]
})
export class ShareSelectModule { }