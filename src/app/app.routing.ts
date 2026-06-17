import { Routes } from "@angular/router";

import { LayoutComponent } from "./layout/layout.component";
import { AppComponent } from "./app.component";
import { NoAuthGuard } from "./core/auth/guards/noAuth.guard";
import { AuthGuard } from "./core/auth/guards/auth.guard";


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // Admin console
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: AppComponent,
    children: [
      // sign-up and onboarding were the cannabis-era dispensary signup flow
      // (youkti lineage). Their backends are unmounted in beanstalk-api
      // (chore/g-unmount-deprecated-surfaces) — left out of routing so
      // the URLs SPA-404 instead of loading a UI that calls 404'd APIs.
      // Admin login still works: AuthService.signIn hits /api/auth/login.
      { path: 'reset-password', loadChildren: () => import('./modules/auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
      { path: 'sign-in', loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then(m => m.SignInModule) }
    ]
  },

  // Authenticated routes
  {
    path: '',
    component: LayoutComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'contests', loadChildren: () => import('./modules/contests/contests.module').then(m => m.ContestsModule) },
      { path: 'portfolio', loadChildren: () => import('./modules/portfolio/portfolio.module').then(m => m.PortfolioModule) },
      { path: 'trading', loadChildren: () => import('./modules/trading/trading.module').then(m => m.TradingModule) }
    ]
  }
];
