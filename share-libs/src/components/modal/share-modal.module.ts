import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModalComponent } from './modal/share-modal.component';
import { PortalModule } from '@angular/cdk/portal';
import { ShareButtonModule } from '../button/share-button.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
/**弹窗组件服务 */
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
