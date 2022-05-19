import { ModuleWithProviders } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { ExShareButtonsComponent } from "../examples/ex-share-buttons/ex-share-buttons.component";
import { ExShareDateComponent } from "../examples/ex-share-date/ex-share-date.component";
import { ExShareSelectComponent } from "../examples/ex-share-select/ex-share-select.component";
import { ExMultiTableComponent } from "../examples/ex-table/ex-multi-table/ex-multi-table.component";
import { LayoutComponent } from "./layout/layout.component";

let routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'example' },
            { path: 'example', loadChildren: () => import('../examples/examples.module').then(m => m.ExamplesModule) },
            { path: 'main', component: ExMultiTableComponent, data: { title: 'Main' } },
            { path: 'manage', component: ExShareButtonsComponent, data: { title: 'manage' } },
            { path: 'manage/page', component: ExShareButtonsComponent, data: { title: 'page' } },
            { path: 'manage/bench', component: ExShareDateComponent, data: { title: 'bench' } },
            { path: 'manage/base/buoy', component: ExShareDateComponent, data: { title: 'buoy' } },
            { path: 'manage/base/buoy/form', component: ExShareDateComponent, data: { title: 'form' } },
            { path: 'manage/base/buoy/change', component: ExShareDateComponent, data: { title: 'change' } },
            { path: 'setting', component: ExShareSelectComponent, data: { title: 'setting' } },
        ]
    },
]

export let layoutRouterModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes)