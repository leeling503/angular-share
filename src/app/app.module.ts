import { NzModalService } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ShareCheckboxModule, ShareDatePickerModule, SharePaginationModule } from 'share-libs';
import { MyComponentComponent } from './my-component/my-component.component';
import { MyD } from './my-component/my-d.directive';
import { HttpClientModule } from '@angular/common/http';
import { ShareTableModule } from 'share-libs/src/components/table/share-table.module';
import { ShareTableMultiHeadModule } from 'share-libs/src/components/table/table-multi-head/table-multi-head.module';
@NgModule({
  declarations: [
    AppComponent,
    MyComponentComponent,
    MyD
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ShareTableModule,
    ShareTableMultiHeadModule,
    ShareCheckboxModule,
    ShareDatePickerModule,
    SharePaginationModule
  ],
  providers: [NzModalService],
  entryComponents: [MyComponentComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
