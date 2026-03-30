import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { OnboardingService } from 'src/app/modules/onboarding/onboarding.service';

@Component({
  selector: 'app-onboarding-step1',
  templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {

  dispensaryInformationForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _onboardingService: OnboardingService,
  ) { }

  ngOnInit(): void {
    this.dispensaryInformationForm = this._formBuilder.group({
      dispensary_name: [this._onboardingService.DispensaryInformationData?.dispensary_name ?? '', [Validators.required]],
      dispensary_description: [this._onboardingService.DispensaryInformationData?.dispensary_description ?? '', Validators.required],
      license_number: [this._onboardingService.DispensaryInformationData?.license_number ?? '']
    });
  }

  nextPage() {
    if (this.dispensaryInformationForm.valid) {
      this._onboardingService.DispensaryInformationData = this.dispensaryInformationForm.value;

      this._router.navigateByUrl('onboarding/step2');
    }
  }

  backPage() {
    this._router.navigateByUrl('/sign-up');
  }
}
