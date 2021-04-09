
import { NgModule } from '@angular/core';
import { MODULES } from 'share-libs';
import { ShareDirectiveModule } from './src/directives/share-directive.module';

@NgModule({
  exports: [MODULES, ShareDirectiveModule]
})
export class ShareLibsModule { }
