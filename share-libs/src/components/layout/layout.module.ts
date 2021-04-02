import { OverlayModule } from '@angular/cdk/overlay';
import { LayoutComponent } from './layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeaderComponent, ContentHeaderComponent
} from './components';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { layoutRouting } from './layout.routing';
import { PortalModule } from "@angular/cdk/portal";
@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    ContentHeaderComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    layoutRouting,
    OverlayModule,
    PortalModule,
  ],
  providers: [],
  exports: [],
  entryComponents: [],
})
export class LayoutModule { }
