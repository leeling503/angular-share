
import { NgModule } from '@angular/core';
import { HasAnyAuthorityDirective } from './src/directives/has-any-authority.directive';
import modules from 'share-libs';

@NgModule({
  declarations: [HasAnyAuthorityDirective],
  imports: [
    ...modules
  ],
  exports: [...modules, HasAnyAuthorityDirective]
})
export class ShareLibsModule { }
