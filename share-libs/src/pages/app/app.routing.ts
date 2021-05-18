import { ModuleWithProviders } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
let routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: "login", loadChildren: () => import('../login/login.module').then(m => m.LoginModule) },
    {
        path: 'layout',
        // canActivateChild: [RouteCanActive],
        loadChildren: () => import('../layout/layout.module').then(m => m.LayoutModule)
    },
    { path: 'error', loadChildren: () => import('../error/error.module').then(m => m.ErrorModule) },
    { path: '**', redirectTo: 'layout' }
]
export const APPROUTER: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules }) 