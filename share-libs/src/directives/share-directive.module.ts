import { NgModule } from '@angular/core';
import { shareDirectives } from '.';

@NgModule({
    declarations: [
        ...shareDirectives
    ],
    exports: [...shareDirectives],
})
export class ShareDirectiveModule { }