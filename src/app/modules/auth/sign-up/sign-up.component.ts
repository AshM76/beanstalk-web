import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { OnboardingService } from '../../onboarding/onboarding.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: []
})
export class SignUpComponent implements OnInit {

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _onboardingService: OnboardingService
  ) { }

  signUpForm!: FormGroup;

  showError: boolean = false;
  messageError: string = "Logon Error";

  ngOnInit(): void {
    this.signUpForm = this._formBuilder.group({
      dispensary_email: [this._onboardingService.AccountData?.dispensary_email, [Validators.required, Validators.email]],
      dispensary_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_dispensary_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  SignUp() {
    this.showError = false;
    this.messageError = '';
    this._spinner.show();
    if (this.signUpForm.valid) {
      this._onboardingService.logon(this.signUpForm.value.dispensary_email).subscribe(resp => {
        if (!resp.error) {
          this.showError = true;
          this.messageError = resp.message;
        } else if (resp.error) {
          this._onboardingService.AccountData = this.signUpForm.value;
          this._router.navigateByUrl('/onboarding');
        } else {
          this.showError = true;
          this.messageError = resp.message;
        }
        this._spinner.hide();
      });
    }
  }
}
