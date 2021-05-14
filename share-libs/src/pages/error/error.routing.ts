import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShareErrorComponent } from "./error.component";

let routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '401' },
    { path: '401', component: ShareErrorComponent }
]

export const ErrorRouterModule: ModuleWithProviders = RouterModule.forChild(routes)