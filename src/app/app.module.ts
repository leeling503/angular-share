import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShareButtonModule, ShareCheckboxModule, ShareDateModule, SharePaginationModule } from 'share-libs';
import { MyComponentComponent } from './my-component/my-component.component';
import { MyD } from './my-component/my-d.directive';
import { HttpClientModule, } from '@angular/common/http';
import { ShareTableModule } from 'share-libs/src/components/table/share-table.module';
import { ShareLibsModule } from 'share-libs/share-libs.module';
import { httpInterceptorProviders } from 'share-libs/src/directives/intercepters';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ShareModalModule } from 'share-libs/src/components/modal/modal.module';
import { ShareModalSelectItemComponent } from 'share-libs/src/components/open-modals/modal-select-item/modal-select-item.component';
let routers: Routes = [{
  path: '', component: MyComponentComponent
}]
const a: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routers)
@NgModule({
  declarations: [
    AppComponent,
    MyComponentComponent,
  ],
  imports: [
    a,
    ShareButtonModule,
    ShareModalModule,
    BrowserModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ShareTableModule,
    ShareCheckboxModule,
    ShareDateModule,
    SharePaginationModule,
    ShareLibsModule
  ],
  providers: [httpInterceptorProviders],
  entryComponents: [MyComponentComponent, ShareModalSelectItemComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }


