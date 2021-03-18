import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareCheckboxComponent } from './share-checkbox.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ShareCheckboxComponent],
  exports: [ShareCheckboxComponent]
})
export class ShareCheckboxModule { }
