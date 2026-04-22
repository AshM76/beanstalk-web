import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError, map } from 'rxjs';
import { DispensaryService } from '../dispensary/dispensary.service';

import { environment } from 'src/environments/environment';
import { ApiResponse } from '../types/api-response.type';

@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _dispensaryService: DispensaryService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for account type
     * main - for main account
     * secondary - for secondary account
     */
    set accountType(accountType: string) {
        localStorage.setItem('accountType', accountType);
    }

    get accountType(): string {
        return localStorage.getItem('accountType') ?? '';
    }

    /**
     * Setter & getter for account id
     */
    set accountId(id: string) {
        localStorage.setItem('accountId', id);
    }

    get accountId(): string {
        return localStorage.getItem('accountId') ?? '';
    }

    /**
     * Setter & getter for account username
     */
    set accountUsername(username: string) {
        localStorage.setItem('accountUsername', username);
    }

    get accountUsername(): string {
        return localStorage.getItem('accountUsername') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password - Send Code
     *
     * @param email
     */
    sendCode(email: string) {
        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/auth/dispensary/passwordCodeGenerate/${email}`)
            .pipe(
                map(resp => resp),
                catchError(err => of({ error: true, message: err['error']['message'] }))
            );
    }


    /**
       * Reset password - Validate Code
       *
       * @param email
       * @param code
       */
    validateCode(email: string, code: string) {
        return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/auth/passwordCodeValidate/${email}/${code}`)
            .pipe(
                map(resp => resp),
                catchError(err => of({ error: true, message: err['error']['message'] }))
            );
    }

    /**
       * Reset password
       *
       * @param password
       */
    restorePassword(email: string, restore: string) {
        return this._httpClient.put<ApiResponse>(`${environment.baseUrl}/web/auth/dispensary/passwordRestore/${email}`, { restore: restore })
            .pipe(
                map(resp => resp),
                catchError(err => of({ error: true, message: err['error']['message'] }))
            );
    }
    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<ApiResponse> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError(() => new Error('User is already logged in.'));
        }

        return this._httpClient.post<any>(`${environment.baseUrl}/api/auth/login`, credentials).pipe(
            switchMap((response: any) => {
                this.accessToken = response.token;
                this._authenticated = true;
                this.accountType = 'main';
                this.accountId = response.user_id;
                this.accountUsername = response.name;
                this._dispensaryService.dispensaryId = response.user_id;
                this._dispensaryService.dispensaryName = response.name;
                return of(response);
            }),
            catchError(err => of(err))
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                //this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accountType');
        localStorage.removeItem('accountId');
        localStorage.removeItem('accountUsername');

        // Remove the dispensary data from the local storage
        this._dispensaryService.clearDispensaryData();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {

        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        } else {
            return of(true);
        }

        // Check the access token expire date
        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        //return this.signInUsingToken();
    }
}
