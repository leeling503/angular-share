import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExShareButtonsComponent } from "share-libs/src/examples/ex-share-buttons/ex-share-buttons.component";
import { ExShareDateComponent } from "share-libs/src/examples/ex-share-date/ex-share-date.component";
import { ExShareRadioComponent } from "share-libs/src/examples/ex-share-radio/ex-share-radio.component";
import { ExShareSelectComponent } from "share-libs/src/examples/ex-share-select/ex-share-select.component";
import { ExShareTableComponent } from "share-libs/src/examples/ex-share-table/ex-share-table.component";
import { LayoutComponent } from "./layout/layout.component";

let routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'main' },
            { path: 'main', component: ExShareTableComponent },
            { path: 'manage', component: ExShareButtonsComponent },
            { path: 'manage/page', component: ExShareButtonsComponent },
            { path: 'manage/bench', component: ExShareDateComponent },
            { path: 'manage/base/buoy', component: ExShareDateComponent },
            { path: 'manage/base/buoy/form', component: ExShareDateComponent },
            { path: 'manage/base/buoy/change', component: ExShareDateComponent },
            { path: 'example', component: ExShareRadioComponent },
            { path: 'setting', component: ExShareSelectComponent }
        ]
    },

]

export let layoutRouterModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes)