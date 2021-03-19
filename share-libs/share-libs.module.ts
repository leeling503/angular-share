
import { NgModule } from '@angular/core';
import modules from 'share-libs';
import { ShareDirectiveModule } from './src/directives/share-directive.module';

@NgModule({
  exports: [...modules, ShareDirectiveModule]
})
export class ShareLibsModule { }
