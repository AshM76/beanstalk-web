import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { DispensaryAccount } from 'src/app/core/account/account.types';

import { DispensaryProfileService } from '../../dispensary-profile.service';

@Component({
    selector: 'app-details-dispensary-account',
    templateUrl: 'details-dispensary-account.component.html'
})
export class DetailsDispensaryAccountComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activateRoute: ActivatedRoute,
        private _spinnerService: NgxSpinnerService,
        private _dispensaryProfileService: DispensaryProfileService,
    ) { }

    account!: DispensaryAccount;

    ngOnInit() {

        const accountId = this._activateRoute.snapshot.paramMap.get('id') ?? '';

        this._dispensaryProfileService.account$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((account: DispensaryAccount) => {                
                if (!account.dispensary_account_store)
                    account.dispensary_account_store = {
                        store_id: '',
                        store_name: '',
                        store_addressLine1: '',
                        store_city: '',
                        store_state: '',
                        store_zip: '',
                        store_available: false,
                        store_main: 2,
                        store_hours: [],
                        store_photos: []
                    };

                this.account = account;
            });

        this._spinnerService.show();

        this._dispensaryProfileService.getDispensaryAccount(accountId).subscribe(response => {
            this._spinnerService.hide();
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
}
