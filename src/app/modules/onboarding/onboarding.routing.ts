import { Routes } from '@angular/router';

import { OnboardingGuard } from './onboarding.guard';
import { OnboardingComponent } from './onboarding.component';

import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { Step4Component } from './steps/step4/step4.component';

export const onboardingRoutes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    canActivate: [OnboardingGuard],
    children:[
      {
        path: '',
        redirectTo: 'step1',
      },
      {
        path: 'step1',
        component: Step1Component,
      },
      {
        path: 'step2',
        component: Step2Component
      },
      {
        path: 'step3',
        component: Step3Component
      },
      {
        path: 'step4',
        component: Step4Component
      },
    ]
  },
];
