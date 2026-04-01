import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, BehaviorSubject } from 'rxjs';

import { ApiResponse } from '../types/api-response.type';

import { DispensaryService } from '../dispensary/dispensary.service';
import { DispensaryAccount, AdminAccount } from './account.types';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
    account!: DispensaryAccount;
    adminAccount$ = new BehaviorSubject<AdminAccount | null>(null);
    private adminAccount: AdminAccount | null = null;
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

    /**
     * Admin Account Methods
     */

    /**
     * Get admin user from stored session
     */
    getAdminUser(): AdminAccount | null {
        return this.adminAccount;
    }

    /**
     * Set admin user session
     */
    setAdminUser(admin: AdminAccount): void {
        this.adminAccount = admin;
        this.adminAccount$.next(admin);
        // Store in localStorage for persistence
        localStorage.setItem('adminUser', JSON.stringify(admin));
    }

    /**
     * Clear admin session
     */
    clearAdminUser(): void {
        this.adminAccount = null;
        this.adminAccount$.next(null);
        localStorage.removeItem('adminUser');
    }

    /**
     * Load admin from localStorage
     */
    loadAdminSession(): AdminAccount | null {
        const stored = localStorage.getItem('adminUser');
        if (stored) {
            try {
                this.adminAccount = JSON.parse(stored);
                this.adminAccount$.next(this.adminAccount);
                return this.adminAccount;
            } catch (e) {
                this.clearAdminUser();
            }
        }
        return null;
    }

    /**
     * Login admin user
     */
    adminLogin(email: string, password: string): Observable<AdminAccount> {
        return this._httpClient
            .post<ApiResponse>(`${environment.baseUrl}/api/admin/auth/login`, { email, password })
            .pipe(
                map((response) => {
                    const admin: AdminAccount = response.data.admin;
                    this.setAdminUser(admin);
                    return admin;
                }),
                catchError((err) => {
                    throw err;
                })
            );
    }

    /**
     * Logout admin user
     */
    adminLogout(): Observable<any> {
        return this._httpClient.post(`${environment.baseUrl}/api/admin/auth/logout`, {}).pipe(
            map(() => {
                this.clearAdminUser();
            }),
            catchError((err) => {
                this.clearAdminUser();
                return of(err);
            })
        );
    }

    /**
     * Get admin profile
     */
    getAdminProfile(adminId: string): Observable<AdminAccount> {
        return this._httpClient
            .get<ApiResponse>(`${environment.baseUrl}/api/admin/profile/${adminId}`)
            .pipe(
                map((response) => response.data.admin),
                catchError((err) => {
                    throw err;
                })
            );
    }
}