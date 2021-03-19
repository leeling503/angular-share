import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/share-table.component';
import { SharePaginationModule } from '../pagination/share-pagination.module';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { TableExpendComponent } from './table-expend/share-table-expend.component';
import { TableMultiHeadComponent } from './table-multi-head/table-multi-head.component';

@NgModule({
  imports: [
    CommonModule,
    ShareDirectiveModule,
    ShareCheckboxModule,
    SharePaginationModule
  ],
  declarations: [TableComponent, TableExpendComponent, TableMultiHeadComponent],
  exports: [TableComponent, TableExpendComponent, TableMultiHeadComponent]
})
export class ShareTableModule { }
