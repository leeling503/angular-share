import { RouterModule, Routes } from "@angular/router";
import { ExShareButtonsComponent } from "./ex-share-buttons/ex-share-buttons.component";
import { ExShareDateComponent } from "./ex-share-date/ex-share-date.component";
import { ExShareFileComponent } from "./ex-share-file/ex-share-file.component";
import { ExShareFormComponent } from "./ex-share-form/ex-share-form.component";
import { ExShareInputComponent } from "./ex-share-input/ex-share-input.component";
import { ExShareMapComponent } from "./ex-share-map/ex-share-map.component";
import { ExShareModalComponent } from "./ex-share-modal/ex-share-modal.component";
import { ExShareRadioComponent } from "./ex-share-radio/ex-share-radio.component";
import { ExShareSelectComponent } from "./ex-share-select/ex-share-select.component";
import { ExShareSwiperComponent } from "./ex-share-swiper/ex-share-swiper.component";
import { ExShareThreeModelComponent } from "./ex-share-three-model/ex-share-three-model.component";
import { ExMultiTableComponent } from "./ex-table/ex-multi-table/ex-multi-table.component";
import { ExTableComponent } from "./ex-table/ex-table/ex-table.component";
import { ExMain } from "./examples.component";

let routes: Routes = [
    {
        path: '', component: ExMain, children: [
            { path: '', pathMatch: 'full', redirectTo: 'button' },
            { path: 'button', component: ExShareButtonsComponent, data: { title: '按钮' } },
            { path: 'table', component: ExTableComponent, data: { title: '普通表格' } },
            { path: 'multi-table', component: ExMultiTableComponent, data: { title: '多表头表格' } },
            { path: 'box', component: ExShareRadioComponent, data: { title: '多种选框' } },
            { path: 'select', component: ExShareSelectComponent, data: { title: '选择框' } },
            { path: 'date-time', component: ExShareDateComponent, data: { title: '时间日期' } },
            { path: 'file', component: ExShareFileComponent, data: { title: '文件上传' } },
            { path: '3d', component: ExShareThreeModelComponent, data: { title: '3d模型' } },
            { path: 'map', component: ExShareMapComponent, data: { title: '地图' } },
            { path: 'input', component: ExShareInputComponent, data: { title: '输入框' } },
            { path: 'modal', component: ExShareModalComponent, data: { title: '弹窗' } },
            { path: 'swiper', component: ExShareSwiperComponent, data: { title: '轮播图' } },
            { path: 'form', component: ExShareFormComponent, data: { title: '表单' } },
        ]
    },
]
export const ExRouteModule = RouterModule.forChild(routes)