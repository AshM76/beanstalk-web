import { Routes } from '@angular/router'
import { AdminComponent } from './admin.component'
import { AdminGuard, RoleGuard } from '../../core/auth/admin.guard'
import { AdminUserType } from '../../core/account/account.types'

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'contests',
        loadChildren: () =>
          import('./contest-manager/contest-manager.module').then((m) => m.ContestManagerModule),
        canActivate: [RoleGuard],
        data: { permission: 'manage_contests' },
      },
      // Users / Compliance / Analytics sub-modules are authored but have
      // pre-existing template compile errors (keyvalue destructuring, Math
      // access, multi-binding, etc). Re-enable their loadChildren entries as
      // each submodule is fixed. Sidebar links to these 404 in the meantime.
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
]
