import { ShareSelectModule } from './../select/share-select.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { SharePaginationComponent } from './share-pagination.component';
import { ShareInputNumberDirective } from 'share-libs/src/directives/input-number.directive';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    imports: [CommonModule, FormsModule, PortalModule, OverlayModule],
    declarations: [SharePaginationComponent],
    exports: [SharePaginationComponent]
})
export class SharePaginationModule { }