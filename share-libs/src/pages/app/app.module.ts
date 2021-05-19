import { OverlayModule } from "@angular/cdk/overlay"
import { CommonModule } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouterModule } from "@angular/router"
import { httpInterceptorProviders } from "share-libs/src/services/intercepters"
import { RouteReuseModule } from "share-libs/src/services/route-reuse/route-reuse.module"
import { AppMainComponent } from "./app.component"
import { APPROUTER } from "./app.routing"

@NgModule({
  declarations: [
    AppMainComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    OverlayModule,
    RouterModule,
    APPROUTER,
    // 路由复用策略模块
    RouteReuseModule
  ],
  providers: [httpInterceptorProviders],
  entryComponents: [],
  bootstrap: [AppMainComponent],
})
export class AppMainModule { }


