import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: []
})
export class SignInComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _spinner: NgxSpinnerService
  ) { }

  showError: boolean = false;
  messageError: string = "Login Error";

  remember: boolean = false;

  signInForm!: FormGroup;

  ngOnInit(): void {
    this.signInForm = this._formBuilder.group({
      dispensary_email: ['', [Validators.required, Validators.email]],
      dispensary_password: ['', Validators.required],
      remember_me: [false]
    });
  }

  get signInFormControl() {
    return this.signInForm.controls;
  }

  SignIn() {
    this.showError = false;
    this.messageError = '';
    this._spinner.show();

    this._authService.signIn(this.signInForm.value).subscribe(resp => {
      if (resp.error) {
        this.showError = true;
        this.messageError = resp.message;
      } else {
        this._router.navigateByUrl('/dashboard');
      }

      this._spinner.hide();
    });
  }
}
