import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { OnboardingService } from '../../onboarding.service';

@Component({
  selector: 'app-onboarding-step4',
  templateUrl: './step4.component.html'
})
export class Step4Component implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _onboardingService: OnboardingService,
    private _spinner: NgxSpinnerService
  ) { }

  showError: boolean = false;
  messageError: string = "Logon Error";

  dispensaryAgreementAcceptedForm!: FormGroup;

  ngOnInit(): void {
    this.dispensaryAgreementAcceptedForm = this._formBuilder.group({
      agreement_accepted: [this._onboardingService.AgreementAccepted, [Validators.required]]
    });
  }

  complete(): void {
    this.showError = false;
    this.messageError = '';
    this._spinner.show();
    if (this.dispensaryAgreementAcceptedForm.valid) {
      this._onboardingService.AgreementAccepted = this.dispensaryAgreementAcceptedForm.value.agreement_accepted;

      // Create Dispensary
      this._onboardingService.onboarding().subscribe(resp => {
        if (resp.error) {
          this.showError = true;
          this.messageError = resp.message;
        } else {
          // Add Main Store
          this._onboardingService.addMainStore().subscribe(resp => {
            if (resp.error) {
              this.showError = true;
              this.messageError = resp.message;
            } else {
              this._onboardingService.clearDispensaryData();
              this._router.navigateByUrl('/dashboard');
            }

            this._spinner.hide();
          });
        }
      });
    }
  }
  backPage(): void {
    this._router.navigateByUrl('onboarding/step3');
  }
}
