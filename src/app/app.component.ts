import { CdkPortal, TemplatePortal } from '@angular/cdk/portal';
import { Component, Injector, ChangeDetectorRef, TemplateRef, ViewChild, ComponentRef } from '@angular/core';
import { TimeRange } from 'share-libs/src/components/date-picker/share-date-picker.model';
import { ShareModalService } from 'share-libs/src/components/modal/modal.service';
import { ShareModalSelectItemComponent } from 'share-libs/src/components/open-modals/modal-select-item/modal-select-item.component';
import { PaginationPage } from 'share-libs/src/components/pagination/share-pagination.model';
import { SelectConfig, SelectOption } from 'share-libs/src/components/select/share-select.model';
import { TableItem } from 'share-libs/src/components/table/share-table.model';
import { TableComponent } from 'share-libs/src/components/table/table/share-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
}
