import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShareClearIconDirective } from 'share-libs/src/directives/share-clear-icon.directive';
import { ShareDatePickerComponent } from './date-day/share-date-day.component';
import { ShareDateMonthComponent } from './date-month/share-date-month.component';
import { DateRangePickerDirective } from './date-range-picker.directive';
import { ShareDateYearComponent } from './date-year/share-date-year.component';
@NgModule({
    declarations: [
        ShareDatePickerComponent,
        ShareDateMonthComponent,
        ShareDateYearComponent,
        DateRangePickerDirective,
        ShareClearIconDirective],
    imports: [CommonModule, FormsModule, OverlayModule, PortalModule],
    exports: [ShareDatePickerComponent, ShareDateMonthComponent, ShareDateYearComponent]
})
export class ShareDatePickerModule { }