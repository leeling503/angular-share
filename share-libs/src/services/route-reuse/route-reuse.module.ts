import { NgModule } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomStrategy } from './custom-strategy.service';
import { CustomReuseStrategy } from './custom-reuse-strategy';

/**
 * 路由复用策略
 */
@NgModule({
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy,
      deps: [CustomStrategy]
    },
    // { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy }
  ],
})
export class RouteReuseModule { }
