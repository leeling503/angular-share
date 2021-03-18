import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModalComponent } from './modal.component';
import { PortalModule } from '@angular/cdk/portal';
@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
  ],
  declarations: [ShareModalComponent],
  entryComponents: [ShareModalComponent],
  providers: [],
  exports: [
    ShareModalComponent,
    OverlayModule,
    PortalModule]
})
export class ShareModalModule { }
