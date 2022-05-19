import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReuseRouteData } from "share-libs/services/route-reuse/reuse-tab";
import { Error504Component } from "./error-504/error-504.component";
import { Error401Component } from "./error-401/error-401.component";

let routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '401' },
    { path: '401', component: Error401Component, data: new ReuseRouteData('', false) },
    { path: '504', component: Error504Component, data: new ReuseRouteData('', false) }
]

export const ErrorRouterModule: ModuleWithProviders = RouterModule.forChild(routes)