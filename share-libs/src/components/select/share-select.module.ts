import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckModule } from '../check/share-check.module';
import { ShareSelectComponent } from './select-base/share-select.component';
import { ShareSelectAdd } from './select-add/share-select-add.component';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { ShareSelectPanelComponent } from './select-panel/share-select-panel.component';
import { NodePanel } from './node-panel/node-panel.component';
import { NodeAdd } from './node-add/node-add.component';
import { NodeSelect } from './node-select/node-select.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareDirectiveModule, ShareCheckModule],
    declarations: [ShareSelectComponent, ShareSelectAdd, ShareSelectPanelComponent, NodeSelect, NodePanel, NodeAdd],
    providers: [],
    exports: [ShareSelectComponent, ShareSelectAdd, ShareSelectPanelComponent]
})
export class ShareSelectModule { }