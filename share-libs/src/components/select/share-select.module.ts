import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckModule } from '../check/share-check.module';
import { ShareSelectComponent } from './select-base/share-select.component';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { PanelNodes } from './panel-nodes/panel-nodes.component';
import { PanelSelect } from './panel-select/panel-select.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareDirectiveModule, ShareCheckModule],
    declarations: [ShareSelectComponent, PanelSelect, PanelNodes],
    providers: [],
    exports: [ShareSelectComponent]
})
export class ShareSelectModule { }