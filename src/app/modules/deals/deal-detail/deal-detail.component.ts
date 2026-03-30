import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import * as moment from 'moment';

import { MenuItem, Message, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';
import { DealsService } from '../deals.service';

import { Store } from 'src/app/core/dispensary/dispensary.types';
import { Deal } from '../deals.types';

@Component({
  selector: 'app-deal-detail',
  templateUrl: './deal-detail.component.html',
  styleUrls: ['../deals.component.css'],
  providers: [MessageService]
})
export class DealDetailComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  private start!: moment.Moment;
  private end!: moment.Moment;
  private push!: moment.Moment;
  private today: moment.Moment = moment();

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-th-large', routerLink: '/dashboard' };

  deal!: Deal;
  availableStores: Store[] = [];

  constructor(
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _spinnerService: NgxSpinnerService,
    private _dealsService: DealsService,
    private _dispensaryService: DispensaryService
  ) { }

  /**
   * On init
   */
  ngOnInit(): void {

    this.items = [
      { label: 'Deals', routerLink: '/deals' },
      { label: 'Detail' },
    ];

    const dealId = this._activateRoute.snapshot.paramMap.get('id') as string;

    this._spinnerService.show();

    this._dealsService.loadDealDetail(dealId)
      .subscribe(resp => {
        this._spinnerService.hide();
      });

    this._dispensaryService.listDispensaryStores().subscribe(response => {
      this.availableStores = response;
    });

    this._dealsService.deal$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((deal: Deal) => {
        this.deal = deal;

        this.push = moment(this.deal.deal_publish_pushDate);
        this.start = moment(this.deal.deal_startDate);
        this.end = moment(this.deal.deal_endDate);
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

  getStoreName(storeId: string): string {
    const storeName = this.availableStores.find(s => s.store_id == storeId)?.store_name;
    return storeName ?? '';
  }

  checkValidPublishDate(): boolean {
    return this.push.isValid() && this.push.isBefore(this.end) && this.today.isBefore(this.end);
  }

  publishDeal() {
    this._spinnerService.show();
    this.deal.deal_status = 'published';

    this._dealsService.updateDeal(this.deal.deal_id, this.deal).subscribe(result => {
      if (result.error) {
        this._spinnerService.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: result.message });
      } else {
        this._spinnerService.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: result.message });

        this._router.navigateByUrl('/deals');
      }
    });
  }
}
