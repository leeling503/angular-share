import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/share-table.component';
import { SharePaginationModule } from '../pagination/share-pagination.module';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { TableExpendComponent } from './table-expend/share-table-expend.component';
import { TableMultiHeadComponent } from './table-multi-head/table-multi-head.component';
import { FilterTableHeadComponent } from './filter-table-head/filter-table-head.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ShareInputModule } from '../input/share-input.module';
import { ShareOpenModalsModule } from '../open-modals/open-modals.module';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    ShareDirectiveModule,
    ShareInputModule,
    ShareCheckboxModule,
    SharePaginationModule,
    ShareOpenModalsModule
  ],
  declarations: [FilterTableHeadComponent, TableComponent, TableExpendComponent, TableMultiHeadComponent],
  exports: [TableComponent, TableExpendComponent, TableMultiHeadComponent]
})
export class ShareTableModule { }
