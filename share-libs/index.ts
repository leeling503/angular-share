import { ShareDateModule } from './src/components/date-picker/share-date-picker.module';
import { ShareCheckboxModule } from './src/components/checkbox/share-checkbox.module';
import { ShareButtonModule } from './src/components/button/button.module';
import { SharePaginationModule } from './src/components/pagination/share-pagination.module';
import { ShareRadioModule } from './src/components/radio/share-radio.module';
import { ShareSelectModule } from './src/components/select/share-select.module';
import { ShareTableModule } from './src/components/table/share-table.module';
import { ShareViewFlvModule } from './src/components/view-flv/share-view-flv.module';
import { ShareFileUploadModule } from './src/components/upload-file/share-file-upload.module';
import { Share3DModule } from './src/components/three-model/three-model.module';
import { ShareMapModule } from './src/components/map/share-map.module';


export { ShareDateModule, ShareSelectModule, ShareTableModule, ShareCheckboxModule, ShareButtonModule, ShareRadioModule, SharePaginationModule, ShareViewFlvModule, ShareFileUploadModule, Share3DModule, ShareMapModule };
export const MODULES = [
    ShareRadioModule,
    ShareDateModule,
    ShareSelectModule,
    ShareCheckboxModule,
    ShareButtonModule,
    SharePaginationModule,
    ShareTableModule,
    ShareViewFlvModule,
    ShareFileUploadModule,
    Share3DModule
];