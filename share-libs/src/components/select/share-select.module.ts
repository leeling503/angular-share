import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareCheckModule } from '../check/share-check.module';
import { ShareSelectComponent } from './select-base/share-select.component';
import { ShareDirectiveModule } from 'share-libs/src/directives/share-directive.module';
import { NodePanel } from './node-panel/node-panel.component';
import { NodeSelect } from './node-select/node-select.component';
@NgModule({
    imports: [CommonModule, FormsModule, OverlayModule, ShareDirectiveModule, ShareCheckModule],
    declarations: [ShareSelectComponent, NodeSelect, NodePanel],
    providers: [],
    exports: [ShareSelectComponent]
})
export class ShareSelectModule { }