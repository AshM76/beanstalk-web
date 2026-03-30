import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: [
  ]
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private routing: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.restoreEmailForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.restoreCodeForm = this._formBuilder.group({
      code: ['', [Validators.required, Validators.pattern('[0-9]{6}$')]]
    });

    this.restorePasswordForm = this._formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  restoreEmailForm!: FormGroup;
  restoreCodeForm!: FormGroup;
  restorePasswordForm!: FormGroup;

  sendEmail: boolean = true;
  emailVerified: boolean = false;
  codeVerified: boolean = false;

  showError: boolean = false;
  messageError: string = "Restore Error";

  verifyEmail() {
    this.showError = false;
    this.messageError = '';
    this.spinner.show();
    if (this.restoreEmailForm.valid) {

      this._authService.sendCode(this.restoreEmailForm.value.email).subscribe(resp => {
        if (resp.error) {
          this.showError = true;
          this.messageError = resp.message;
        } else {
          this.sendEmail = false;
          this.emailVerified = true;
        }
        this.spinner.hide();
      });
    }
  }

  verifyCode() {
    this.showError = false;
    this.messageError = '';
    this.spinner.show();
    if (this.restoreCodeForm.valid) {
      this._authService.validateCode(this.restoreEmailForm.value.email, this.restoreCodeForm.value.code).subscribe(resp => {
        if (resp.error) {
          this.showError = true;
          this.messageError = resp.message;
        } else {
          this.emailVerified = false;
          this.codeVerified = true;
        }
        this.spinner.hide();
      });
    }
  }

  restorePass() {
    this.showError = false;
    this.messageError = '';
    this.spinner.show();

    if (this.restorePasswordForm.valid) {
      this._authService.restorePassword(this.restoreEmailForm.value.email, this.restorePasswordForm.value.password).subscribe(resp => {
        console.log(resp)
        if (resp.error) {
          this.showError = true;
          this.messageError = resp.message;
        } else {
          this.routing.navigateByUrl('/');
        }
        this.spinner.hide();
      });
    }
  }

  backPage() {
    this.routing.navigateByUrl('/sign-in');
  }

}
