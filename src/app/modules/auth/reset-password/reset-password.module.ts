import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';
import { ResetPasswordComponent } from './reset-password.component';
import { authResetPasswordRoutes } from './reset-password.routing';

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(authResetPasswordRoutes),
        PrimeNgModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class ResetPasswordModule
{
}
