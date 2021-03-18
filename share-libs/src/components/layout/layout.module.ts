import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderComponent,
  ContentHeaderComponent
} from './components';
import { NzMenuModule, NzLayoutModule } from 'ng-zorro-antd';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { layoutRouting } from './layout.routing';
import {PortalModule} from "@angular/cdk/portal";
import { StatisticsComponent } from 'src/app/core/statistics/statistics.component';
import { DeviceTypeComponent } from 'src/app/core/statistics/device-type/device-type.component';
import { QueryComponent } from 'src/app/core/query/query.component';
import { MonitorChartComponent } from 'src/app/core/query/monitor-chart/monitor-chart.component';
import { MonitorListComponent } from 'src/app/core/query/monitor-list/monitor-list.component';
import { DateRangePickerDirective } from 'src/app/directives';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SlDatePickerModule } from '../date-picker/sl-data-picker.module';
@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    ContentHeaderComponent,
    SidebarComponent,
    StatisticsComponent,
    DeviceTypeComponent,
    QueryComponent,
    MonitorChartComponent,
    MonitorListComponent,
   
    DateRangePickerDirective
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    SharedModule,
    NzLayoutModule,
    layoutRouting,
    SlDatePickerModule,
    OverlayModule,
    PortalModule, 
  ],
  providers: [],
  exports: [],
  entryComponents: [],
})
export class LayoutModule { }
