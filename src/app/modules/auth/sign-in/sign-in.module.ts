import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';
import { SignInComponent } from './sign-in.component';
import { authSignInRoutes } from './sign-in.routing';

@NgModule({
    declarations: [
        SignInComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(authSignInRoutes),
        ReactiveFormsModule,
        PrimeNgModule,
        NgxSpinnerModule
    ]
})
export class SignInModule
{
}
