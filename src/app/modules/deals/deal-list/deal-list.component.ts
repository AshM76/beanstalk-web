import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api/menuitem';

import { DealsService } from '../deals.service';
import { Deal } from '../deals.types';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['../deals.component.css']
})
export class DealListComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [];

  home: MenuItem = { icon: 'pi pi-th-large', routerLink: '/deals' };

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  deals: Deal[] = [];

  constructor(
    private _spinnerService: NgxSpinnerService,
    private _dealsService: DealsService,
  ) { }

  /**
   * On init
   */
  ngOnInit() {

    this.items = [
      { label: 'Deals' },
    ];

    this._dealsService.deals$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((deals: Deal[]) => {
        this.deals = deals;
      });

    this._spinnerService.show();
    this._dealsService.loadDealsByDispensary()
      .subscribe(resp => {
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
