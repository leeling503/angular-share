import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckboxModule } from '../checkbox/share-checkbox.module';
import { ShareSelectComponent } from './select/share-select.component';
import { ShareSelectAdd } from './select-add/share-select-add.component';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { ShareSelectPanelComponent } from './select-panel/share-select-panel.component';
import { NodePanel } from './node-panel/node-panel.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareDirectiveModule, ShareCheckboxModule],
    declarations: [ShareSelectComponent, ShareSelectAdd, ShareSelectPanelComponent, NodePanel],
    providers: [],
    exports: [ShareSelectComponent, ShareSelectAdd, ShareSelectPanelComponent]
})
export class ShareSelectModule { }