import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { catchError, map, of, tap } from 'rxjs';

import * as moment from 'moment';

import { AuthService } from 'src/app/core/auth/auth.service';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

import { ApiResponse } from 'src/app/core/types/api-response.type';
import { Credentials, Information, SocialMedia, Store } from './onboarding.types';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  AccountData!: Credentials;

  DispensaryInformationData!: Information;

  MainStoreData!: Store;

  SocialMediaData!: SocialMedia;

  AgreementAccepted: boolean = true;

  constructor(private _httpClient: HttpClient, private _authservice: AuthService, private _dispensaryService: DispensaryService) { }

  //GET: logon
  logon(email: string) {
    return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/auth/dispensary/emailVerification/${email}`)
      .pipe(
        map(resp => resp),
        catchError(err => of(err)
        ));
  }

  //POST: onboarding
  onboarding() {
    const url = `${environment.baseUrl}/web/auth/dispensary/signup`;
    const body = {
      dispensary_email: this.AccountData.dispensary_email,
      dispensary_password: this.AccountData.dispensary_password,

      dispensary_license: this.DispensaryInformationData.license_number,
      dispensary_name: this.DispensaryInformationData.dispensary_name,
      dispensary_description: this.DispensaryInformationData.dispensary_description,
      dispensary_logo: '',

      dispensary_agreementAccepted: this.AgreementAccepted,

      dispensary_available: true,

      dispensary_ownerApp: 'Beanstalk',
    };

    return this._httpClient.post<ApiResponse>(url, body)
      .pipe(
        tap(response => {

          // Store the dispensary data on the dispensary service
          this._dispensaryService.dispensaryId = response.data.dispensaryId;
          this._dispensaryService.dispensaryName = response.data.dispensaryName;

          this._authservice.accessToken = response.token;

          //Store the account data on the auth service
          this._authservice.accountType = response.data.dispensaryType;

          this._authservice.accountId = response.data.dispensaryId;
          this._authservice.accountUsername = response.data.dispensaryName;
        }),
        map(resp => resp),
        catchError(err => of(err))
      );
  };

  addMainStore() {
    const url = `${environment.baseUrl}/web/dispensary/profile/store/add/${this._dispensaryService.dispensaryId}`;
    const body = {
      store_name: this.MainStoreData.store_name,
      store_description: this.MainStoreData.store_description,
      store_phone: this.MainStoreData.store_phone,
      store_email: this.MainStoreData.store_email,
      store_photos: [],
      store_addressLine1: this.MainStoreData.store_addressLine1,
      store_addressLine2: this.MainStoreData.store_addressLine2,
      store_city: this.MainStoreData.store_city,
      store_state: this.MainStoreData.store_state,
      store_zip: this.MainStoreData.store_zip,
      store_website: this.SocialMediaData.website,
      store_facebook: this.SocialMediaData.facebook,
      store_instagram: this.SocialMediaData.instagram,
      store_twitter: this.SocialMediaData.twitter,
      store_youtube: this.SocialMediaData.youtube,
      store_hours: this.MainStoreData.store_hours.filter(h => h.opensAt).map(hour => { 
        return {
          day:hour.day, 
          opensAt: moment(hour.opensAt).format('hh:mm A'), 
          closesAt: moment(hour.closesAt).format('hh:mm A')
        }
      }),
      store_main: 1,
      store_available: true,
      store_dispensary_id: this._dispensaryService.dispensaryId,
      store_dispensary_name: this._dispensaryService.dispensaryName
    };

    return this._httpClient.post<ApiResponse>(url, body)
      .pipe(
        map(resp => resp),
        catchError(err => of(err))
      )
  };

  clearDispensaryData() {
    this.AccountData = {
      dispensary_email: '',
      dispensary_password: ''
    };

    this.DispensaryInformationData = {
      license_number: '',
      dispensary_name: '',
      dispensary_description: '',
      dispensary_logo: '',
    };

    this.MainStoreData = {
      store_dispensary_id: '',
      store_dispensary_name: '',
      store_name: '',
      store_description: '',
      store_phone: '',
      store_email: '',
      store_addressLine1: '',
      store_addressLine2: '',
      store_city: '',
      store_state: '',
      store_zip: '',
      store_main: 1,
      store_available: false,
      store_hours: []
    };

    this.SocialMediaData = {
      website: '',
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: ''
    };

    this.AgreementAccepted = false;
  }

}
