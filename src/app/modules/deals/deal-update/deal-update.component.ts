import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, Message } from 'primeng/api';

import { DealsService } from '../deals.service';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';
import { Deal } from '../deals.types';
import { Store } from 'src/app/core/dispensary/dispensary.types';
import { CloudStorageService } from 'src/app/core/cloud/cloud-storege.service';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deal-update',
  templateUrl: './deal-update.component.html',
  styleUrls: ['../deals.component.css']
})
export class DealUpdateComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  items: MenuItem[] = [];

  home: MenuItem = { icon: 'pi pi-th-large', routerLink: '/dashboard' };

  updating: boolean = false;

  dealUpdateForm!: FormGroup;
  dealId: string = '';

  availableStores: Store[] = [];
  typeOfProducts: any[] = [];
  typeOfferDate: { code: string, label: string }[] = [];
  timeZones: {code: string, name: string}[] = [];

  today: Date = new Date();
  minEndDate: Date = new Date();
  minPushDate: Date = new Date();
  maxPushDate: Date = new Date();

  showMessage: Message[] = [];
  errorMessage: String = '';

  constructor(
    private _activateRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _spinnerService: NgxSpinnerService,
    private _dealsService: DealsService,
    private _dispensaryService: DispensaryService
  ) {
    this.typeOfProducts = [
      'None',
      'Flower',
      'Edible (Solid)', 'Edible (Liquid)',
      'Concentrate',
      'Topical',
      'Paraphernalia',
      'Marijuana Pre-Roll (Plain)',
      'Clone',
      'Extract',
      'Bulk Flower',
      'Kratom',
      'Soda',
      'Snack',
      'Seeds',
      'Non-Taxable Hemp products',
      'Apparel',
      'Infused Pre-roll (Concentrate)',
      'Combined',
      'Other Inhalable Cannabinoid Product',
    ];

    this.typeOfferDate = [{ code: 'oneday', label: 'One Day' }, { code: 'custom', label: 'Custom Range' }];
    this.timeZones = [
      {code: '-0700', name: 'Pacific Time'},
      {code: '-0500', name: 'Central Time'},
      {code: '-0400', name: 'Eastern Time'},
    ];
  }

  ngOnInit(): void {

    const dealId = this._activateRoute.snapshot.paramMap.get('id') as string;

    this.dealId = dealId ?? '';

    if (this._dealsService.dealUpdate) {
      this.updating = true;
      console.log("UPDATE")
    } else {
      this.updating = false;
      console.log("RE-PUBLISH")
    }

    this._dispensaryService.listDispensaryStores().subscribe(response => {
      this.availableStores = response;
    });

    this.items = [
      { label: 'Deals', routerLink: '/deals' },
      { label: 'Detail', routerLink: `/deals/detail/${dealId}` },
      { label: 'Update' },
    ];

    this._spinnerService.show();

    this._dealsService.loadDealDetail(dealId)
      .subscribe(resp => {
        this._spinnerService.hide();
      });

    this.dealUpdateForm = this._formBuilder.group({
      deal_id: [''],
      deal_title: [null, [Validators.required]],
      deal_description: ['', [Validators.required]],
      deal_imageURL: ['', [Validators.required]],
      deal_stores_availables: [[], [Validators.required]],
      deal_typeOfDeal: ['', [Validators.required]],
      deal_amount: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      deal_offer: [{ value: '', disabled: true }, [Validators.required]],
      deal_typeOfProduct: [''],
      deal_brandOfProduct: [''],
      deal_rangeDeal: ['', [Validators.required]],
      deal_startDate: [, [Validators.required]],
      deal_endDate: [{ value: '', disabled: true }, [Validators.required]],
      deal_url: ['', [Validators.pattern('https?://.+')]],
      deal_publish_pushDate: [{ value: '', disabled: true }, [Validators.required]],
      deal_publish_timeZone: [{ value: '', disabled: true }, [Validators.required]],
      deal_status: ['published']
    });

    this._dealsService.deal$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((deal: Deal) => {
        this.dealUpdateForm.patchValue(deal);

        //hack to correct mapping
        this.dealUpdateForm.patchValue({ deal_stores_availables: deal.deal_stores_availables.map(s => s.store_id)});
        this.handleTypeOfferDate(deal.deal_rangeDeal);
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

  handleTypeOfferDate(typeOfferDate: string) {
    switch (typeOfferDate) {
      case 'custom':
        this.dealUpdateForm.controls['deal_endDate'].enable();
        this.dealUpdateForm.controls['deal_endDate'].enable();
        break;
      default:
        this.dealUpdateForm.controls['deal_endDate'].disable();
        this.dealUpdateForm.controls['deal_endDate'].disable();
        break;
    }
  }

  handlePushNotification(condition: boolean) {
    const action = condition ? 'enable' : 'disable';
    this.dealUpdateForm.controls['deal_publish_pushDate'][action]();
    this.dealUpdateForm.controls['deal_publish_timeZone'][action](); 
  }

  handleStartDate(date: Date) {
    this.minEndDate = date;
    this.minPushDate = this.today;
    if ((this.dealUpdateForm.controls['deal_rangeDeal'].value ?? '') !== 'custom') {
      this.maxPushDate = date;
    }
  }

  handleEndDate(date: Date) {    
    this.maxPushDate = date;
  }

  updateDeal() {
    console.log(this.dealUpdateForm);
    if (this.dealUpdateForm.valid) {
      this._spinnerService.show();
      this.dealUpdateForm.patchValue({ deal_status: 'published' });
      this._dealsService.updateDeal(this.dealId, this.dealUpdateForm.value).subscribe(resp => {
        if (resp.error) {
          this._spinnerService.hide();
          this.showMessage = [{ severity: 'error', summary: 'Error', detail: resp.message }];
        } else {
          this._spinnerService.hide();
          this.showMessage = [{ severity: 'success', summary: 'Success', detail: resp.message }];

          this.dealUpdateForm.reset();
          this._router.navigateByUrl('/deals');
        }
      });
    } else {
      this._spinnerService.hide();
      this.showMessage = [{ severity: 'error', summary: 'Error', detail: 'parameters required' }];
    }
  }

  rePublishDeal() {
    console.log(this.dealUpdateForm);
    if (this.dealUpdateForm.valid) {
      this._spinnerService.show();

      this.dealUpdateForm.patchValue({ deal_status: 'published' }); // published - saved

      this._dealsService.createDeal(this.dealUpdateForm.value).subscribe(resp => {
        if (resp['error']) {
          this._spinnerService.hide();
          this.showMessage = [{ severity: 'error', summary: 'Error', detail: resp['message'] }];
        } else {
          this._spinnerService.hide();
          this.showMessage = [{ severity: 'success', summary: 'Success', detail: resp['message'] }];

          this.dealUpdateForm.reset();
          this._router.navigateByUrl('/deals');
        }
      })

    } else {
      this._spinnerService.hide();
      this.showMessage = [{ severity: 'error', summary: 'Error', detail: 'parameters required' }];
    }
  }

  /*
    setMinEndDate(): Date {
      return this.dealUpdateForm.deal_startDate;
    }
  
    setMaxPushDate(): Date {
      if (this.dealUpdateForm.deal_rangeDeal == 'custom') {
        const limit = new Date(this.dealUpdateForm.deal_endDate)
        limit.setSeconds(0);
        limit.setMinutes(59);
        limit.setHours(23);
        return this.dealUpdateForm.deal_endDate;
      } else {
        const limit = new Date(this.dealUpdateForm.deal_startDate)
        limit.setSeconds(0);
        limit.setMinutes(59);
        limit.setHours(23);
        return limit;
      }
    }
  
    selectedNotificationDate() {
      this.notificationDateSelected = true;
    }    
  */
}
