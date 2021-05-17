import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { CustomeRouteReuseStrategy } from './route-reuse-strategy';
import { ReuseTabService } from './reuse-tab.service';
import { SimpleReuseStrategy } from './simple-reuse';

/**
 * 路由复用策略
 */
@NgModule({
  imports: [],
  declarations: [],
  providers: [
    ReuseTabService,
    {
      provide: RouteReuseStrategy,
      useClass: CustomeRouteReuseStrategy,
      deps: [ReuseTabService]
    },
    // { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
  ]
})
export class RouteReuseModule { }
