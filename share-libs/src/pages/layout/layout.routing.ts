import { ModuleWithProviders } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
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
            { path: 'main', component: ExShareTableComponent, data: { title: 'Main' } },
            { path: 'manage', component: ExShareButtonsComponent, data: { title: 'manage' } },
            { path: 'manage/page', component: ExShareButtonsComponent, data: { title: 'page' } },
            { path: 'manage/bench', component: ExShareDateComponent, data: { title: 'bench' } },
            { path: 'manage/base/buoy', component: ExShareDateComponent, data: { title: 'buoy' } },
            { path: 'manage/base/buoy/form', component: ExShareDateComponent, data: { title: 'form' } },
            { path: 'manage/base/buoy/change', component: ExShareDateComponent, data: { title: 'change' } },
            { path: 'example', component: ExShareRadioComponent, data: { title: 'example' } },
            { path: 'setting', component: ExShareSelectComponent, data: { title: 'setting' } }
        ]
    },
]

export let layoutRouterModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes)