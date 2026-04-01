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
        path: 'users',
        loadChildren: () =>
          import('./user-management/user-management.module').then((m) => m.UserManagementModule),
        canActivate: [RoleGuard],
        data: { permission: 'view_users' },
      },
      {
        path: 'contests',
        loadChildren: () =>
          import('./contest-manager/contest-manager.module').then((m) => m.ContestManagerModule),
        canActivate: [RoleGuard],
        data: { permission: 'manage_contests' },
      },
      {
        path: 'compliance',
        loadChildren: () =>
          import('./compliance/compliance.module').then((m) => m.ComplianceModule),
        canActivate: [RoleGuard],
        data: { permission: 'manage_eulas' },
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./analytics/analytics.module').then((m) => m.AnalyticsModule),
        canActivate: [RoleGuard],
        data: { permission: 'view_platform_metrics' },
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
]
