import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryProfileService } from '../../dispensary-profile.service';
import { DispensaryAccount } from 'src/app/core/account/account.types';
import { Dispensary, Store } from 'src/app/core/dispensary/dispensary.types';

@Component({
    selector: 'app-update-dispensary-account',
    templateUrl: 'update-dispensary-account.component.html'
})
export class UpdateDispensaryAccountComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dispensaryAccountForm!: FormGroup;

    accountId: string = '';

    stores!: Store[];

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _activateRoute: ActivatedRoute,
        private _spinnerService: NgxSpinnerService,
        private _dispensaryProfileService: DispensaryProfileService) { }

    /**
     * On init
     */
    ngOnInit() {
        const accountId = this._activateRoute.snapshot.paramMap.get('id') as string;

        this.accountId = accountId ?? '';

        this.dispensaryAccountForm = this._formBuilder.group({
            dispensary_id: [''],
            dispensary_account_id: [''],
            dispensary_account_email: [{ value: '', disabled: true }],
            dispensary_account_password: [{ value: '****************', disabled: true }, [Validators.required]],
            dispensary_account_fullname: ['', [Validators.required]],
            dispensary_account_available: [false],
            dispensary_account_store: ['', [Validators.required]]
        });

        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dispensary: Dispensary) => {
                this.stores = dispensary.dispensary_stores;
            });

        this._dispensaryProfileService.account$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((account: DispensaryAccount) => {

                if (account.dispensary_account_id) {
                    this.dispensaryAccountForm.patchValue(account);
                } else {
                    this._router.navigateByUrl('/dispensary/accounts/' + this.accountId);
                }
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

        this._dispensaryProfileService.saveDispensaryAccount(this.dispensaryAccountForm.value).subscribe(response => {
            this._spinnerService.hide();

            if (response instanceof Error) {

            } else {
                const account = response as DispensaryAccount;
                this._router.navigateByUrl('/dispensary/accounts/' + account.dispensary_account_id);
            }
        });
    }
}