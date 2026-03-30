import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';

import { OnboardingComponent } from './onboarding.component';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { Step3Component } from './steps/step3/step3.component';
import { Step4Component } from './steps/step4/step4.component';

import { onboardingRoutes } from './onboarding.routing';

@NgModule({
  declarations: [
    OnboardingComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(onboardingRoutes),
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    NgxSpinnerModule
  ],
  exports: [
    OnboardingComponent
  ]
})
export class OnboardingModule { }
