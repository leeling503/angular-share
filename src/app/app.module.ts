import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShareButtonModule, ShareCheckboxModule, ShareDateModule, SharePaginationModule } from 'share-libs';
import { MyComponentComponent } from './my-component/my-component.component';
import { HttpClientModule, } from '@angular/common/http';
import { httpInterceptorProviders } from 'share-libs/src/services/intercepters';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ShareModalModule } from 'share-libs/src/components/modal/modal.module';
import { ShareModalSelectItemComponent } from 'share-libs/src/components/open-modals/modal-select-item/modal-select-item.component';
import { ShareSelectModule } from 'share-libs/src/components/select/share-select.module';
import { ShareRadioModule } from 'share-libs/src/components/radio/share-radio.module';
import { ExamplesModule } from 'share-libs/src/examples/examples.module';
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
    ShareCheckboxModule,
    ShareDateModule,
    SharePaginationModule,
    ShareSelectModule,
    ShareRadioModule,
    ExamplesModule
  ],
  providers: [httpInterceptorProviders],
  entryComponents: [MyComponentComponent, ShareModalSelectItemComponent],
  bootstrap: [AppComponent],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }


