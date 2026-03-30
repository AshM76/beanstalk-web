import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';

import * as moment from 'moment';

import { ApiResponse } from 'src/app/core/types/api-response.type';
import { Deal, DealCreateResponse } from './deals.types';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DealsService {

  private _deals!: BehaviorSubject<Deal[]>;

  private _selectedDeal!: BehaviorSubject<Deal>;

  dealUpdate: boolean = false;
  dealRePublish: boolean = false;

  timeZones: { offset: number, zone: string }[] = [];

  constructor(
    private _httpClient: HttpClient,
    private _dispensaryService: DispensaryService
  ) {
    this._deals = new BehaviorSubject<Deal[]>([]);

    this._selectedDeal = new BehaviorSubject<Deal>({
      deal_id: '',
      deal_title: '',
      deal_description: '',
      deal_imageURL: '',
      deal_typeOfDeal: '',
      deal_amount: '',
      deal_offer: '',
      deal_rangeDeal: '',
      deal_startDate: new Date(),
      deal_endDate: new Date(),
      deal_status: '',
      deal_dispensary_id: '',
      deal_dispensary_name: '',
      deal_stores_availables: []
    });

    this.timeZones = [{ offset: -4, zone: 'America/New_York' }, { offset: -5, zone: 'America/Chicago' }, { offset: -7, zone: 'America/Los_Angeles' }];
  }

  get deals$(): Observable<Deal[]> {
    return this._deals.asObservable();
  }

  get deal$(): Observable<Deal> {
    return this._selectedDeal.asObservable();
  }

  //GET: Deal List by DispensaryId
  loadDealsByDispensary(): Observable<Deal[]> {
    console.log("::GET/loadDealsByDispensary");
    const dispensaryId: string = this._dispensaryService.dispensaryId;

    return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/deals/${dispensaryId}`)
      .pipe(
        switchMap(response => {
          if (response.data) {
            const deals = response.data.deals.map((deal: Deal) => {
              let tempStartDate = JSON.parse(JSON.stringify(deal.deal_startDate));
              let tempEndDate = JSON.parse(JSON.stringify(deal.deal_endDate));
              let tempPublishDate = deal.deal_publish_pushDate ? JSON.parse(JSON.stringify(deal.deal_publish_pushDate)) : undefined;

              return {
                ...deal,
                deal_imageURL: environment.resourcesUrl + deal.deal_imageURL,
                deal_startDate: new Date(tempStartDate['value']),
                deal_endDate: new Date(tempEndDate['value']),
                deal_publish_pushDate: tempPublishDate ? new Date(tempPublishDate['value']) : undefined
              };
            });

            console.log(deals);

            this._deals.next(deals);

            return of(deals);
          }
          return of([]);
        }),
        catchError(error => of(error))
      );
  }

  //GET: Deal Detail by DealId
  loadDealDetail(dealId: string): Observable<Deal> {
    console.log("::GET/loadDealDetailByDealId");

    return this._httpClient.get<ApiResponse>(`${environment.baseUrl}/web/deals/detail/${dealId}`)
      .pipe(
        switchMap(response => {
          const data = response.data.deal;

          let tempStartDate = JSON.parse(JSON.stringify(data.deal_startDate));
          let tempEndDate = JSON.parse(JSON.stringify(data.deal_endDate));
          let tempPublishDate = data.deal_publish_pushDate ? JSON.parse(JSON.stringify(data.deal_publish_pushDate)) : undefined;
          let offset = this.timeZones.find(tz => tz.zone === data.deal_publish_timeZone)?.offset ?? '';

          const deal = {
            ...data,
            deal_imageURL: environment.resourcesUrl + data.deal_imageURL,
            deal_startDate: new Date(tempStartDate['value']),
            deal_endDate: new Date(tempEndDate['value']),
            deal_publish_pushDate: tempPublishDate ? moment(tempPublishDate['value']).add(offset, 'hour') : undefined
          };

          this._selectedDeal.next(deal);
          return of(deal);
        }),
        catchError(err => of(err))
      )
  }

  //POST: create deal
  createDeal(deal: Deal) {

    console.log("::POST/CREATE-DEAL");

    const start = moment(deal.deal_startDate).startOf('day');
    const end = moment(deal.deal_rangeDeal === 'oneday' ? deal.deal_startDate : deal.deal_endDate).endOf('day');
    console.log(start, end);

    const push = moment(deal.deal_publish_pushDate ?? '');
    const timeZone = deal.deal_publish_timeZone ?? '';

    const url = `${environment.baseUrl}/web/deals/create`;
    const body = {
      ...deal,
      deal_startDate: start.utc(),
      deal_endDate: end.utc(),
      deal_publish_pushDate: push.isValid() ? push.utc() : '',
      deal_publish_timeZone: timeZone,
      deal_stores_availables: deal.deal_stores_availables.map(store => {
        return { store_id: store };
      }),
      deal_dispensary_id: this._dispensaryService.dispensaryId,
      deal_dispensary_name: this._dispensaryService.dispensaryName,
    };

    console.log({ url, body });

    return this._httpClient.post<DealCreateResponse>(url, body)
      .pipe(
        map(resp => resp),
        catchError(err => of(err))
      )
  }

  //PUT: update deal
  updateDeal(dealId: string, deal: Deal) {

    console.log("::PUT/UPDATE-DEAL");

    const start = moment(deal.deal_startDate).startOf('day');
    const end = moment(deal.deal_rangeDeal === 'oneday' ? deal.deal_startDate : deal.deal_endDate).endOf('day');

    const push = moment(deal.deal_publish_pushDate ?? '');
    const timeZone = deal.deal_publish_timeZone ?? '';

    const url = `${environment.baseUrl}/web/deals/update/${dealId}`;
    const body = {
      deal_title: deal.deal_title,
      deal_description: deal.deal_description,
      deal_imageUrl: deal.deal_imageURL.replace(environment.resourcesUrl, ''),
      deal_typeOfDeal: deal.deal_typeOfDeal,
      deal_amount: deal.deal_amount,
      deal_offer: deal.deal_offer,
      deal_typeOfProduct: deal.deal_typeOfProduct,
      deal_brandOfProduct: deal.deal_brandOfProduct,
      deal_rangeDeal: deal.deal_rangeDeal,
      deal_startDate: start.utc(),
      deal_endDate: end.utc(),
      deal_publish_pushDate: push.isValid() ? push.utc() : '',
      deal_publish_timeZone: timeZone,
      deal_url: deal.deal_url,
      deal_status: deal.deal_status,
      deal_stores_availables: deal.deal_stores_availables.map(store => {
        return { store_id: store };
      }),
      deal_dispensary_id: this._dispensaryService.dispensaryId,
      deal_dispensary_name: this._dispensaryService.dispensaryName
    };

    console.log({ url, body });

    return this._httpClient.put<ApiResponse>(url, body)
      .pipe(
        map(resp => resp),
        catchError(err => of(err))
      )
  }
}
