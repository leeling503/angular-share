import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModalComponent } from './modal/modal.component';
import { PortalModule } from '@angular/cdk/portal';
import { ShareButtonModule } from '../button/button.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    ShareButtonModule,
    DragDropModule
  ],
  declarations: [ShareModalComponent,],
  entryComponents: [ShareModalComponent],
  providers: [],
  exports: [ShareModalComponent]
})
export class ShareModalModule { }
