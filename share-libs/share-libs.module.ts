
import { NgModule } from '@angular/core';
import { Share3DModule, ShareButtonModule, ShareCheckboxModule, ShareDateModule, ShareFileUploadModule, ShareInputModule, ShareModalModule, SharePaginationModule, ShareRadioModule, ShareSelectModule, ShareSwiperModule, ShareTableModule , ShareFormModule } from 'share-libs';
import { ShareDirectiveModule } from './src/directives/share-directive.module';

@NgModule({
  exports: [
    ShareDirectiveModule,
    ShareRadioModule,
    ShareDateModule,
    ShareSelectModule,
    ShareCheckboxModule,
    ShareButtonModule,
    SharePaginationModule,
    ShareTableModule,
    ShareFileUploadModule,
    Share3DModule,
    ShareInputModule,
    ShareModalModule,
    ShareSwiperModule,
    ShareFormModule
  ]
})
export class ShareLibsModule { }
