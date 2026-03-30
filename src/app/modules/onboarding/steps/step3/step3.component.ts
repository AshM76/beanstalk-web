import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { OnboardingService } from '../../onboarding.service';

@Component({
  selector: 'app-onboarding-step3',
  templateUrl: './step3.component.html'
})
export class Step3Component implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _onboardingService: OnboardingService
  ) { }

  dispensarySocialMediaForm!: FormGroup;

  ngOnInit(): void {

    this.dispensarySocialMediaForm = this._formBuilder.group({
      website: [this._onboardingService.SocialMediaData?.website??''],
      facebook: [this._onboardingService.SocialMediaData?.facebook??''],
      instagram: [this._onboardingService.SocialMediaData?.instagram??''],
      twitter: [this._onboardingService.SocialMediaData?.twitter??''],
      youtube: [this._onboardingService.SocialMediaData?.youtube??'']
    });
  }

  nextPage(): void {
    if (this.dispensarySocialMediaForm.valid) {
      this._onboardingService.SocialMediaData = this.dispensarySocialMediaForm.value;
      this._onboardingService.AgreementAccepted = true;
      
      this._router.navigateByUrl('onboarding/step4');
    }
  }

  backPage(): void {
    this._router.navigateByUrl('onboarding/step2');
  }
}
