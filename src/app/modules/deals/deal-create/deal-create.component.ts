import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { Message, MenuItem } from 'primeng/api';

import { CloudStorageService } from 'src/app/core/cloud/cloud-storege.service';
import { DealsService } from '../deals.service';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

import { Store } from 'src/app/core/dispensary/dispensary.types';
import * as moment from 'moment';

@Component({
  selector: 'app-deal-create',
  templateUrl: './deal-create.component.html',
  styleUrls: ['../deals.component.css']
})
export class DealCreateComponent implements OnInit {

  items: MenuItem[] = [];

  home: MenuItem = { icon: 'pi pi-th-large', routerLink: '/dashboard' };

  dealForm!: FormGroup;
  availableStores: Store[] = [];
  typeOfDeals: { code: string, label: string, name: string, symbol: string }[] = [];
  typeOfProducts: string[] = [];
  typeOfferDate: { code: string, label: string }[] = [];
  timeZones: { code: string, name: string }[] = [];

  update: boolean = false;
  dealId: string = '';
  today: Date = new Date();
  minEndDate: Date = new Date();
  minPushDate: Date = new Date();
  maxPushDate: Date = new Date();

  imageFile: File = new File([], '');
  uploadedFiles: any = [];
  uploadedFileUrl: SafeUrl = '';

  showMessage: Message[] = [];
  errorMessage: String = '';

  constructor(
    private _activateRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _sanitizer: DomSanitizer,
    private _spinnerService: NgxSpinnerService,
    private _cloudStorageservice: CloudStorageService,
    private _dealsService: DealsService,
    private _dispensaryService: DispensaryService
  ) {

    this.items = [
      { label: 'Deals', routerLink: '/deals' },
      { label: 'Create' },
    ];

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

    this.typeOfDeals = [
      { code: 'discount', label: 'Discount', name: 'Discount', symbol: '%' },
      { code: 'dollar', label: 'Dollars Off', name: 'Dollars Off', symbol: '$' },
      { code: 'bogo', label: 'BOGO', name: 'Buy One Get One For', symbol: '$' },
      { code: 'b2g1', label: 'B1G2', name: 'Buy Two Get One For', symbol: '$' },
      { code: 'offer', label: 'Other', name: 'For', symbol: '$' },
    ];

    this.typeOfferDate = [{ code: 'oneday', label: 'One Day' }, { code: 'custom', label: 'Custom Range' }];

    this.timeZones = [
      { code: 'America/Los_Angeles', name: '(GMT-7:00) Pacific Standard Time' },
      { code: 'America/Chicago', name: '(GMT-5:00) Central Standard Time' },
      { code: 'America/New_York', name: '(GMT-4:00) Eastern Standard Time' },
    ];
  }

  ngOnInit(): void {

    const dealId = this._activateRoute.snapshot.paramMap.get('id') as string;

    this._dispensaryService.listDispensaryStores().subscribe(response => {
      this.availableStores = response;
    });

    this.dealForm = this._formBuilder.group({
      deal_title: [null, [Validators.required]],
      deal_description: ['', [Validators.required]],
      deal_imageURL: ['', [Validators.required]],
      deal_stores_availables: ['', [Validators.required]],
      deal_typeOfDeal: ['', [Validators.required]],
      deal_amount: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      deal_offer: [{ value: '', disabled: true }, [Validators.required]],
      deal_typeOfProduct: [''],
      deal_brandOfProduct: [''],
      deal_rangeDeal: ['', [Validators.required]],
      deal_startDate: [, [Validators.required]],
      deal_endDate: [{ value: '', disabled: true }, [Validators.required]],
      deal_url: ['', [Validators.pattern('https?://.+')]],
      deal_publish_pushNotification: [false],
      deal_publish_pushDate: [{ value: '', disabled: true }, [Validators.required]],
      deal_publish_timeZone: [{ value: '', disabled: true }, [Validators.required]],
      deal_status: ['saved']
    });

    if (dealId) {
      this.update = true;
      this.items = [
        { label: 'Deals', routerLink: '/deals' },
        { label: 'Update' },
      ];
      this._spinnerService.show();
      this.update = true;

      this._dealsService.loadDealDetail(dealId)
        .subscribe(deal => {
          this.dealId = deal.deal_id;

          this.dealForm.patchValue(deal);

          //hack to correct mapping
          if (deal.deal_status === 'closed') {
            this.handleTypeOfferDate('');
            this.handlePushNotification(false);

            this.dealForm.patchValue({
              deal_status: 'saved',
              deal_rangeDeal: '',
              deal_startDate: '',
              deal_endDate: '',
              deal_publish_pushNotification: false,
              deal_publish_pushDate: '',
              deal_publish_timeZone: '',
              deal_stores_availables: deal.deal_stores_availables.map(s => s.store_id)
            });

          } else {
            this.handleTypeOfDeal(deal.deal_typeOfDeal);
            this.handleTypeOfferDate(deal.deal_rangeDeal);
            this.handlePushNotification(!!deal.deal_publish_pushDate);

            this.dealForm.patchValue({
              deal_publish_pushNotification: !!deal.deal_publish_pushDate,
              deal_publish_pushDate: deal.deal_publish_pushDate,
              deal_publish_timeZone: deal.deal_publish_timeZone,
              deal_stores_availables: deal.deal_stores_availables.map(s => s.store_id)
            });
          }

          this._spinnerService.hide();
        });
    }
  }

  get AmountTitle(): string {
    return this.typeOfDeals.find(t => t.code === this.dealForm.controls['deal_typeOfDeal'].value)?.name ?? 'Discount';
  }

  get AmountSymbol(): string {
    return this.typeOfDeals.find(t => t.code === this.dealForm.controls['deal_typeOfDeal'].value)?.symbol ?? '%';
  }

  onUploadImage(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      this.uploadedFileUrl = this._sanitizer.bypassSecurityTrustUrl(file['objectURL']['changingThisBreaksApplicationSecurity']);
      this.imageFile = file;
      this.dealForm.patchValue({ deal_imageURL: this.uploadedFileUrl });
    }
  }

  clearUploadImage() {
    this.uploadedFileUrl = '';
    this.dealForm.patchValue({ deal_imageURL: this.uploadedFileUrl });
  }

  handleTypeOfDeal(typeOfDeal: string) {
    switch (typeOfDeal) {
      case 'offer':
        this.dealForm.controls['deal_offer'].enable();
        this.dealForm.controls['deal_offer'].enable();
        break;
      default:
        this.dealForm.controls['deal_offer'].disable();
        this.dealForm.controls['deal_offer'].disable();
        break;
    }
  }

  handleTypeOfferDate(typeOfferDate: string) {
    switch (typeOfferDate) {
      case 'custom':
        this.dealForm.controls['deal_endDate'].enable();
        this.dealForm.controls['deal_endDate'].enable();
        break;
      default:
        this.dealForm.controls['deal_endDate'].disable();
        this.dealForm.controls['deal_endDate'].disable();
        this.handleEndDate(this.dealForm.controls['deal_startDate'].value)
        break;
    }
    this.clearPushNotification();
  }

  handlePushNotification(condition: boolean) {
    const action = condition ? 'enable' : 'disable';
    this.dealForm.controls['deal_publish_pushDate'][action]();
    this.dealForm.controls['deal_publish_timeZone'][action]();
  }

  handleStartDate(date: Date) {
    this.minEndDate = date;
    this.minPushDate = this.today;
    if ((this.dealForm.controls['deal_rangeDeal'].value ?? '') !== 'custom') {
      this.maxPushDate = date;
    }
    this.clearPushNotification();
  }

  handleEndDate(date: Date) {
    this.maxPushDate = moment(date).endOf('day').toDate();
    this.clearPushNotification();
  }

  clearPushNotification() {
    this.dealForm.patchValue({
      deal_publish_pushDate: '',
      deal_publish_timeZone: '',
    });
  }

  canPublish(): boolean {
    return this.dealForm.controls['deal_publish_pushDate'].value && this.dealForm.valid;
  }

  saveDeal(status: string = 'saved') {
    if (this.dealForm.valid) {
      this._spinnerService.show();

      this._cloudStorageservice.uploadImage(this.imageFile, 'deals').subscribe(response => {
        if (!response.error) {
          this.dealForm.patchValue({ deal_imageURL: response.url, deal_status: status });
        }
        if (this.update) {
          this._dealsService.updateDeal(this.dealId, this.dealForm.value).subscribe(resp => {
            console.log(resp);

            if (resp.error) {
              this._spinnerService.hide();
              this.showMessage = [{ severity: 'error', summary: 'Error', detail: resp.message }];
            } else {
              this._spinnerService.hide();
              this.showMessage = [{ severity: 'success', summary: 'Success', detail: resp.message }];

              this.dealForm.reset();
              this._router.navigateByUrl('/deals');
            }
          });
        } else {
          this._dealsService.createDeal(this.dealForm.value).subscribe(resp => {
            if (resp.error) {
              this._spinnerService.hide();
              this.showMessage = [{ severity: 'error', summary: 'Error', detail: resp.message }];
            } else {
              this._spinnerService.hide();
              this.showMessage = [{ severity: 'success', summary: 'Success', detail: resp.message }];

              this.dealForm.reset();
              this._router.navigateByUrl('/deals');
            }
          });
        }
      });
    } else {
      this._spinnerService.hide();
      this.showMessage = [{ severity: 'error', summary: 'Error', detail: 'parameters required' }];
    }
  }

}
