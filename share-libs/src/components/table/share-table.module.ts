import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/share-table.component';
import { SharePaginationModule } from '../pagination/share-pagination.module';

@NgModule({
  imports: [
    CommonModule,
    ShareCheckboxModule,
    SharePaginationModule
  ],
  declarations: [TableComponent],
  exports:[TableComponent]
})
export class ShareTableModule { }
