import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DispensaryAccount } from 'src/app/core/account/account.types';
import { Store } from 'src/app/core/dispensary/dispensary.types';

import { DispensaryProfileService } from '../dispensary-profile.service';

@Component({
    selector: 'app-dispensary-accounts',
    templateUrl: 'dispensary-accounts.component.html'
})
export class DispensaryAccountsComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    mainAccount!: DispensaryAccount;
    secondaryAccounts: DispensaryAccount[] = [];
    
    constructor(
        private _dispensaryProfileService: DispensaryProfileService
    ) { }

    /**
     * On init
     */
    ngOnInit() {
        
        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(dispensary=> {
                
                const main_account: DispensaryAccount = {
                    dispensary_id: dispensary.dispensary_id,
                    dispensary_account_id: dispensary.dispensary_id,
                    dispensary_account_email: dispensary.dispensary_email,
                    dispensary_account_fullname: dispensary.dispensary_name,
                    dispensary_account_store: {
                        store_id: '',
                        store_name: '',
                        store_addressLine1: '',
                        store_city: '',
                        store_state: '',
                        store_zip: '',
                        store_available: true,
                        store_main: 1,
                        store_hours:[],
                        store_photos:[]
                    },
                    dispensary_account_available: dispensary.dispensary_available
                };

                const secondary_accounts: DispensaryAccount[] = dispensary.dispensary_accounts.map(account => {
                    const store_id = account.dispensary_account_store as unknown as string;
                    const store = dispensary.dispensary_stores.find(s => s.store_id === store_id);
                    
                    if(store){
                        account.dispensary_account_store = store as Store;
                    }
                    
                    return account

                });

                this.mainAccount = main_account;
                this.secondaryAccounts = secondary_accounts;
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
