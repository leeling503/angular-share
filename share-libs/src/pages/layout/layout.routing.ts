import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExShareButtonsComponent } from "share-libs/src/examples/ex-share-buttons/ex-share-buttons.component";
import { ExShareTableComponent } from "share-libs/src/examples/ex-share-table/ex-share-table.component";
import { ShareLayoutComponent } from "./share-layout/share-layout.component";

let routes: Routes = [
    {
        path: '', component: ShareLayoutComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'main' },
            { path: 'main', component: ExShareTableComponent },
            { path: 'manage', component: ExShareButtonsComponent },
        ]
    },

]

export let layoutRouterModule: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes)