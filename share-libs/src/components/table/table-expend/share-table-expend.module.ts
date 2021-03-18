import { ShareCheckboxModule } from '../../checkbox/share-checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableExpendComponent } from './share-table-expend.component';
import { SharePaginationModule } from '../../pagination/share-pagination.module';

@NgModule({
  imports: [
    CommonModule,
    ShareCheckboxModule,
    SharePaginationModule
  ],
  declarations: [TableExpendComponent],
  exports: [TableExpendComponent]
})
export class ShareTableExpendModule { }
