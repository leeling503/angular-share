import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { CustomeRouteReuseStrategy } from './route-reuse-strategy';
import { ReuseTabService } from './reuse-tab.service';
import { SimpleReuseStrategy } from './simple-reuse';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ReuseTabService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomeRouteReuseStrategy,
      deps: [ReuseTabService]
    }]
})
export class RouteReuseModule { }
