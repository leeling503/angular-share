import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { StatisticsComponent } from 'src/app/core/statistics/statistics.component';
import { QueryComponent } from 'src/app/core/query/query.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [],
        canActivateChild: [],
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'monitor', pathMatch: 'full' },
            { path: 'monitor', loadChildren: () => import("src/app/core/monitor/monitor.module").then(m => m.MonitorModule) },
            { path: 'query', component: QueryComponent },
            { path: 'statistics', component: StatisticsComponent },
            { path: 'sys', loadChildren: () => import("src/app/core/sys/sys.module").then(m => m.SysModule) }
        ]
    },
];

export let layoutRouting: ModuleWithProviders = RouterModule.forChild(routes)
