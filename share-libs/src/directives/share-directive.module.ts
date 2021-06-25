import { NgModule } from '@angular/core';
import { SHAREDIRECTIVES } from '.';

@NgModule({
    declarations: [
        ...SHAREDIRECTIVES
    ],
    exports: [...SHAREDIRECTIVES],
})
export class ShareDirectiveModule { }