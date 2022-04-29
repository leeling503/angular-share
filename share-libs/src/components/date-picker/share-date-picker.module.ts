import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { ShareCalendarBaseComponent } from './calendar-base/calendar-base.component';
import { ShareCalendarPanelComponent } from './calendar-panel/calendar-panel.component';
import { ShareDateDayComponent } from './date-day/share-date-day.component';
import { ShareDateMonthComponent } from './date-month/share-date-month.component';
import { DateRangePickerDirective } from './date-range-picker.directive';
import { ShareDateYearComponent } from './date-year/share-date-year.component';
@NgModule({
    declarations: [
        ShareDateMonthComponent,
        ShareDateYearComponent,
        ShareDateDayComponent,
        ShareCalendarBaseComponent,
        DateRangePickerDirective,
        ShareCalendarPanelComponent
    ],
    imports: [CommonModule, ShareDirectiveModule, FormsModule, OverlayModule, PortalModule],
    exports: [ShareDateDayComponent, ShareDateMonthComponent, ShareCalendarBaseComponent, ShareDateYearComponent, ShareCalendarPanelComponent]
})
export class ShareDateModule { }