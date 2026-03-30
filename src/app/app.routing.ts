import { Routes } from "@angular/router";

import { LayoutComponent } from "./layout/layout.component";
import { AppComponent } from "./app.component";
import { NoAuthGuard } from "./core/auth/guards/noAuth.guard";
import { AuthGuard } from "./core/auth/guards/auth.guard";


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: AppComponent,
    children: [
      { path: 'reset-password', loadChildren: () => import('./modules/auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
      { path: 'sign-in', loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then(m => m.SignInModule) },
      { path: 'sign-up', loadChildren: () => import('./modules/auth/sign-up/sign-up.module').then(m => m.SignUpModule) },
      { path: 'onboarding', loadChildren: () => import('./modules/onboarding/onboarding.module').then(m => m.OnboardingModule) }
    ]
  },

  // Auth routes for authenticated users
  {
    path: '',
    component: LayoutComponent,
    canActivate:[AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'dispensary', loadChildren: () => import('./modules/dispensary-profile/dispensary-profile.module').then(m => m.DispensaryProfileModule)},
      { path: 'deals', loadChildren: ()=>import('./modules/deals/deals.module').then(m => m.DealsModule)},
      { path: 'chat', loadChildren: () => import('./modules/chat/chat.module').then(m => m.ChatModule)}
    ]
  }
];
