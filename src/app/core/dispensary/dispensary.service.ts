import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

import { ApiResponse } from '../types/api-response.type';
import { DispensaryAccount } from '../account/account.types';
import { Dispensary, Store, StoreHour } from './dispensary.types';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DispensaryService {
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for dispensaryId
     *
     * @param id
     */

    set dispensaryId(id: string) {
        localStorage.setItem('dispensaryId', id);
    }

    get dispensaryId(): string {
        return localStorage.getItem('dispensaryId') ?? '';
    }

    /**
     * Setter & getter for dispensaryType
     *
     * @param type
     */

     set dispensaryType(type: string) {
        localStorage.setItem('dispensaryType', type);
    }

    get dispensaryType(): string {
        return localStorage.getItem('dispensaryType') ?? '';
    }

    /**
     * Setter & getter for dispensaryName
     *
     * @param name
     */

    set dispensaryName(name: string) {
        localStorage.setItem('dispensaryName', name);
    }

    get dispensaryName(): string {
        return localStorage.getItem('dispensaryName') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    clearDispensaryData(): void {
        localStorage.removeItem('dispensaryId');
        localStorage.removeItem('dispensaryName');
    }

    /**
     * Get the current logged in dispensary data
     */
    getDispensary(): Observable<Dispensary> {

        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/${this.dispensaryId}`).pipe(
            switchMap((response) => {
                if (response.data.dispensary.dispensary_logo) {
                    response.data.dispensary.dispensary_logo = `${environment.resourcesUrl}${response.data.dispensary.dispensary_logo}`;
                }

                return of(response.data.dispensary);
            })
        );
    }

    /**
     * Update dispensary profile data
     */
    updateDispensaryProfile(dispensary: Dispensary): Observable<Dispensary> {

        if (dispensary.dispensary_logo) {
            dispensary.dispensary_logo = dispensary.dispensary_logo.replace(environment.resourcesUrl, '');
        }
        return this._httpClient.put<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/update/${this.dispensaryId}`, dispensary).pipe(
            switchMap((response) => {

                if (response.data.dispensary.dispensary_logo) {
                    response.data.dispensary.dispensary_logo = `${environment.resourcesUrl}${response.data.dispensary.dispensary_logo}`;
                }
                
                return of(response.data.dispensary);
            })
        );
    }

    /**
     * Get stores of dispensary
     */
    listDispensaryStores(): Observable<Store[]> {

        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/store/list/${this.dispensaryId}`).pipe(
            switchMap((response) => {
                return of(response.data.stores);
            })
        );
    }

    /**
     * Get store data by Id
     */
    getDispensaryStore(storeId: string): Observable<Store> {

        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/store/${storeId}`).pipe(
            switchMap((response) => {
                const store = {
                    ...response.data.store,
                    store_photos: response.data.store.store_photos.map((p: { photo_url: string }) => { return { photo_url: `${environment.resourcesUrl}${p.photo_url}` } }),
                    store_hours: response.data.store.store_hours.map((hour: StoreHour) => {
                        return {
                            day: hour.day,
                            selected_day: true,
                            opensAt: moment((hour.opensAt as unknown as { value: string }).value).format('hh:mm A'),
                            closesAt: moment((hour.closesAt as unknown as { value: string }).value).format('hh:mm A')
                        }
                    })
                };

                return of(store);
            })
        );
    }

    /**
     * Save store data
     */
    saveDispensaryStore(store: Store): Observable<Store> {
        const action = store.store_id ? 'put' : 'post';
        const identifier = store.store_id ? store.store_id : this.dispensaryId;

        const url = `${environment.baseUrl}/web/dispensary/profile/store/${store.store_id ? 'update' : 'add'}/${identifier}`;
        const body = {
            ...store,
            store_hours: store.store_hours.filter(h => h.opensAt).map(hour => {
                const open = moment(hour.opensAt);
                const close = moment(hour.closesAt);

                return {
                    day: hour.day,
                    opensAt: open.isValid() ? open.format('hh:mm A') : hour.opensAt,
                    closesAt: close.isValid() ? close.format('hh:mm A') : hour.closesAt
                }
            }),
            store_photos: store.store_photos.map(p => { return { photo_url: p.photo_url.replace(environment.resourcesUrl, '') } }),
            store_main: 2,
            store_dispensary_id: this.dispensaryId,
            store_dispensary_name: this.dispensaryName
        };

        return this._httpClient[action]<ApiResponse>(url, body)
            .pipe(
                switchMap(resp => of(resp.data.store ? resp.data.store : resp.data)),
                catchError(err => of(err))
            )
    };

    /**
     * Get dispensary secondary account
     */
    getDispensaryAccount(accountId: string): Observable<DispensaryAccount> {

        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/${this.dispensaryId}/account/${accountId}`).pipe(
            switchMap((response) => {
                return of(response.data.dispensary);
            })
        );
    }

    /**
     * Save store data
     */
    saveDispensaryAccount(account: DispensaryAccount): Observable<DispensaryAccount> {

        const action = account.dispensary_account_id ? 'put' : 'post';

        const identifier = account.dispensary_account_id ? account.dispensary_account_id : this.dispensaryId;

        const url = `${environment.baseUrl}/web/dispensary/profile/account/${account.dispensary_account_id ? 'update' : 'add'}/${identifier}`;

        const body = account.dispensary_account_id
            ? {
                dispensary_account_fullname: account.dispensary_account_fullname,
                dispensary_account_store: account.dispensary_account_store,
                dispensary_account_available: account.dispensary_account_available
            }
            : {
                ...account,
                dispensary_id: this.dispensaryId,
                dispensary_account_ownerApp: 'beanstalk'
            }


        return this._httpClient[action]<ApiResponse>(url, body)
            .pipe(
                switchMap(resp => of(resp.data.account ? resp.data.account : resp.data)),
                catchError(error => throwError( () => new Error(error.message)))
            )
    }
}

