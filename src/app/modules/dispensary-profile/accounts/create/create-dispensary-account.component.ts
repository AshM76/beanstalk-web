import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryProfileService } from '../../dispensary-profile.service';
import { Dispensary, Store } from 'src/app/core/dispensary/dispensary.types';
import { DispensaryAccount } from 'src/app/core/account/account.types';

@Component({
    selector: 'create-update-dispensary-account',
    templateUrl: 'create-dispensary-account.component.html'
})
export class CreateDispensaryAccountComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dispensaryAccountForm!: FormGroup;

    accountId: string = '';

    stores!: Store[];

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _spinnerService: NgxSpinnerService,
        private _dispensaryProfileService: DispensaryProfileService) { }

    /**
     * On init
     */
    ngOnInit() {
        this.dispensaryAccountForm = this._formBuilder.group({
            dispensary_id: [''],
            dispensary_account_id: [''],
            dispensary_account_email: ['', [Validators.required, Validators.email]],
            dispensary_account_password: ['', [Validators.required]],
            dispensary_account_fullname: ['', [Validators.required]],
            dispensary_account_available: [true],
            dispensary_account_store: ['', [Validators.required]]
        });

        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dispensary: Dispensary) => {
                this.stores = dispensary.dispensary_stores;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    saveDispensaryAccount(): void {
        this._spinnerService.show();

        this._dispensaryProfileService.saveDispensaryAccount(this.dispensaryAccountForm.value).subscribe((response: DispensaryAccount | Error) => {
            this._spinnerService.hide();

            if (response instanceof Error) {
                this.dispensaryAccountForm.controls['dispensary_account_email'].setErrors({'already': true});
            } else {
                const account = response as DispensaryAccount;
                this._router.navigateByUrl('/dispensary/accounts/' + account.dispensary_account_id);
            }
        });
    }
}