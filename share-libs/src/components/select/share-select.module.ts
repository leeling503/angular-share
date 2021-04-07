import { CdkPortal } from '@angular/cdk/portal';
import { OverlayModule, CdkConnectedOverlay, CdkOverlayOrigin, } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { ShareSelectComponent } from './share-select.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareCheckboxModule],
    declarations: [ShareSelectComponent],
    providers: [],
    exports: [ShareSelectComponent, ShareCheckboxModule]
})
export class ShareSelectModule { }