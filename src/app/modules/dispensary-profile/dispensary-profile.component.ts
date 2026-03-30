import { Component, OnInit } from '@angular/core';

import { Message, MenuItem } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryProfileService } from './dispensary-profile.service';

@Component({
  selector: 'app-dispensary-profile',
  templateUrl: './dispensary-profile.component.html'
})
export class DispensaryProfileComponent implements OnInit {

  items: MenuItem[] = [];

  profileOptions!: MenuItem[];

  home: MenuItem = { icon: 'pi pi-th-large', routerLink: '/dashboard' };

  showMessage: Message[] = [];
  errorMessage: String = '';

  constructor(
    private _spinnerService: NgxSpinnerService,
    private _dispensaryProfileService: DispensaryProfileService
  ) { }

  ngOnInit(): void {
    this.items = [
      { label: 'Profile' },
    ];

    this.profileOptions = [{
      label: 'Profile',
      routerLink: '/dispensary/profile'
    }, {
      label: 'Stores',
      routerLink: '/dispensary/stores'
    }, {
      label: 'Accounts',
      routerLink: '/dispensary/accounts'
    }];

    this._spinnerService.show();

    this._dispensaryProfileService.loadDispensaryProfile().subscribe(response => {
      this._spinnerService.hide();
    });
  }
}
