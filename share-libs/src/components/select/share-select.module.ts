import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { ShareSelectComponent } from './select/share-select.component';
import { ShareSelectAdd } from './select-add/share-select-add.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareCheckboxModule],
    declarations: [ShareSelectComponent, ShareSelectAdd],
    providers: [],
    exports: [ShareSelectComponent, ShareSelectAdd]
})
export class ShareSelectModule { }