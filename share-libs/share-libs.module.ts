
import { NgModule } from '@angular/core';
import { Share3DModule, ShareButtonModule, ShareCheckModule, ShareDateModule, ShareFileUploadModule, ShareInputModule, ShareModalModule, SharePaginationModule, ShareRadioModule, ShareSelectModule, ShareSwiperModule, ShareTableModule , ShareFormModule } from 'share-libs';
import { ShareDirectiveModule } from './directives/share-directive.module';
import { PipeModule } from './pipe/pipe.module';

@NgModule({
  exports: [
    ShareDirectiveModule,
    ShareRadioModule,
    ShareDateModule,
    ShareSelectModule,
    ShareCheckModule,
    ShareButtonModule,
    SharePaginationModule,
    ShareTableModule,
    ShareFileUploadModule,
    Share3DModule,
    ShareInputModule,
    ShareModalModule,
    ShareSwiperModule,
    ShareFormModule,
    PipeModule
  ]
})
export class ShareLibsModule { }
