import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { DispensaryAccount } from 'src/app/core/account/account.types';

import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';
import { Dispensary, Store } from 'src/app/core/dispensary/dispensary.types';

@Injectable({ providedIn: 'root' })
export class DispensaryProfileService {

    private _dispensaryProfileData!: Dispensary;

    private _dispensary!: BehaviorSubject<Dispensary>;

    private _selectedStore!: BehaviorSubject<Store>;

    private _selectedAccount!: BehaviorSubject<DispensaryAccount>;

    constructor(private _dispensaryService: DispensaryService) {

        this._dispensary = new BehaviorSubject<Dispensary>({
            dispensary_id: '',
            dispensary_name: '',
            dispensary_description: '',
            dispensary_email: '',
            dispensary_available: false,
            dispensary_license: '',
            dispensary_stores: [],
            dispensary_accounts: []
        });

        this._selectedStore = new BehaviorSubject<Store>({
            store_id: '',
            store_name: '',
            store_addressLine1: '',
            store_city: '',
            store_state: '',
            store_zip: '',
            store_main: 2,
            store_available: false,
            store_hours: [],
            store_photos: []
        });

        this._selectedAccount = new BehaviorSubject<DispensaryAccount>({
            dispensary_account_id: '',
            dispensary_id: '',
            dispensary_account_fullname: '',
            dispensary_account_email: '',
            dispensary_account_store: {
                store_id: '',
                store_name: '',
                store_addressLine1: '',
                store_city: '',
                store_state: '',
                store_zip: '',
                store_available: true,
                store_main: 1,
                store_hours: [],
                store_photos: []
            },
            dispensary_account_available: false
        });
    }

    get dispensary$(): Observable<Dispensary> {
        return this._dispensary.asObservable();
    }

    loadDispensaryProfile(): Observable<Dispensary> {
        return this._dispensaryService.getDispensary().pipe(
            switchMap(dispensary => {
                this._dispensaryProfileData = dispensary;
                this._dispensary.next(dispensary);
                return of(dispensary)
            })
        );
    }

    updateProfile(dispensary: Dispensary): Observable<Dispensary> {

        return this._dispensaryService.updateDispensaryProfile(dispensary).pipe(
            switchMap(result => {
                this._dispensaryProfileData.dispensary_name = result.dispensary_name;
                this._dispensaryProfileData.dispensary_description = result.dispensary_description;
                this._dispensaryProfileData.dispensary_license = result.dispensary_license;
                this._dispensaryProfileData.dispensary_logo = result.dispensary_logo;

                this._dispensary.next(this._dispensaryProfileData);
                return of(result)
            })
        );
    }

    get store$(): Observable<Store> {
        return this._selectedStore.asObservable();
    }

    getStoreDetail(storeId: string): Observable<Store> {

        return this._dispensaryService.getDispensaryStore(storeId).pipe(
            switchMap(result => {
                this._selectedStore.next(result);
                return of(result)
            })
        );
    }

    saveStoreData(store: Store) {

        return this._dispensaryService.saveDispensaryStore(store).pipe(
            switchMap(result => {
                // Find the index of the updated store
                const index = this._dispensaryProfileData.dispensary_stores.findIndex(s => s.store_id === result.store_id);
                if (index >= 0) {
                    // Update the store
                    this._dispensaryProfileData.dispensary_stores[index] = result;
                    this._selectedStore.next(result);
                }
                else {
                    // Add the store
                    const data = { ...store, store_id: result.store_id }
                    this._dispensaryProfileData.dispensary_stores = [...this._dispensaryProfileData.dispensary_stores, data];
                    this._selectedStore.next(data);
                }

                this._dispensary.next(this._dispensaryProfileData);
                
                return of(result);
            })
        );
    }

    get account$(): Observable<DispensaryAccount> {
        return this._selectedAccount.asObservable();
    }

    getDispensaryAccount(accountId: string): Observable<DispensaryAccount> {

        return this._dispensaryService.getDispensaryAccount(accountId).pipe(
            switchMap(result => {
                this._selectedAccount.next(result);
                return of(result)
            })
        );
    }

    saveDispensaryAccount(account: DispensaryAccount): Observable<DispensaryAccount|Error> {

        return this._dispensaryService.saveDispensaryAccount(account).pipe(
            switchMap(result => {
                
                // Find the index of the updated store
                const index = this._dispensaryProfileData.dispensary_accounts.findIndex(a => a.dispensary_account_id === result.dispensary_account_id);
                if (index >= 0) {
                    // Update the store
                    this._dispensaryProfileData.dispensary_accounts[index] = result;
                    this._selectedAccount.next(result);
                }
                else {
                    // Add the store
                    const data = { ...account, dispensary_account_id: result.dispensary_account_id }
                    this._dispensaryProfileData.dispensary_accounts = [...this._dispensaryProfileData.dispensary_accounts, data];
                    this._selectedAccount.next(data);
                }

                this._dispensary.next(this._dispensaryProfileData);
                
                return of(result);
            }),
            catchError(error => of(error))
        );
    }
}
