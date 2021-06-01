import { ModuleWithProviders } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { RouteCanActive } from "share-libs/src/services/routers/route-can-active.service";
let routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: "login", loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
    { path: 'error', loadChildren: () => import('../error/error.module').then(m => m.ErrorModule) },
    {
        path: 'layout',
        canActivateChild: [RouteCanActive],
        loadChildren: () => import('../layout/layout.module').then(m => m.LayoutModule)
    },
    { path: '**', redirectTo: 'layout' }
]
export const APPROUTER: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules }) 