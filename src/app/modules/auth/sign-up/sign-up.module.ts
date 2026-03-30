import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';
import { SignUpComponent } from './sign-up.component';
import { authSignupRoutes } from './sign-up.routing';

@NgModule({
    declarations: [
        SignUpComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(authSignupRoutes),
        ReactiveFormsModule,
        PrimeNgModule,
        NgxSpinnerModule
    ]
})
export class SignUpModule
{
}
