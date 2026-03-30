import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

import { ApiResponse } from '../types/api-response.type';

import { DispensaryService } from '../dispensary/dispensary.service';
import { DispensaryAccount } from './account.types';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DispensaryAccountService {
    account!: DispensaryAccount;
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _dispensaryService: DispensaryService) {
    }

    /**
     * Get account data by Id
     */
    get(accountId: string): Observable<DispensaryAccount> {

        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/dispensary/profile/${this._dispensaryService.dispensaryId}/account/${accountId}`).pipe(
            switchMap((response) => {
                return of(response.data.dispensary);
            })
        );
    }

    /**
     * Save store data
     */
    save(account: DispensaryAccount) {

        const action = account.dispensary_account_id ? 'put' : 'post';

        const identifier = account.dispensary_account_id ? account.dispensary_account_id : this._dispensaryService.dispensaryId;

        const url = `${environment.baseUrl}/web/dispensary/profile/account/${account.dispensary_account_id ? 'update' : 'add'}/${identifier}`;

        const body = account.dispensary_account_id
            ? { 
                dispensary_account_fullname: account.dispensary_account_fullname, 
                dispensary_account_store: account.dispensary_account_store, 
                dispensary_account_available: account.dispensary_account_available 
            }
            : { 
                ...account, 
                dispensary_id: this._dispensaryService.dispensaryId, 
                dispensary_account_ownerApp: 'beanstalk' 
            }

        return this._httpClient[action]<ApiResponse>(url, body)
            .pipe(
                map(resp => resp),
                catchError(err => of(err))
            )
    };
}