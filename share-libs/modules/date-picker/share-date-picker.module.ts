import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShareDirectiveModule } from 'share-libs/directives/share-directive.module';
import { ShareSelectModule } from '../select/share-select.module';
import { ShareCalendarBaseComponent } from './calendar-base/calendar-base.component';
import { ShareCalendarPanelComponent } from './calendar-panel/calendar-panel.component';
import { ShareCalendarComponent } from './calendar/calendar.component';
import { ShareDateDayComponent } from './date-day/share-date-day.component';
import { ShareDateMonthComponent } from './date-month/share-date-month.component';
import { DateRangePickerDirective } from './date-range-picker.directive';
import { ShareDateYearComponent } from './date-year/share-date-year.component';
import { PanelMonthComponent } from './panel-month/panel-month.component';
@NgModule({
    declarations: [
        ShareDateMonthComponent,
        ShareDateYearComponent,
        ShareDateDayComponent,
        DateRangePickerDirective,
        ShareCalendarComponent,
        ShareCalendarBaseComponent,
        ShareCalendarPanelComponent,
        PanelMonthComponent,
    ],
    imports: [CommonModule, ShareDirectiveModule, FormsModule, OverlayModule, PortalModule, ShareSelectModule],
    exports: [ShareDateDayComponent, ShareDateMonthComponent, ShareCalendarBaseComponent, ShareDateYearComponent, ShareCalendarPanelComponent, ShareCalendarComponent]
})
export class ShareDateModule { }