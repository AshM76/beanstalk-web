import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PrimeNgModule } from '../../shared/prime-ng.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { NgxSpinnerModule } from "ngx-spinner";

import { DispensaryProfileComponent } from './dispensary-profile.component';
import { ViewDispensaryProfileComponent } from './profile/view/view-dispensary-profile.componet';
import { UpdateDispensaryProfileComponent } from './profile/update/update-dispensary-profile.componet';

import { DispensaryStoresComponent } from './stores/dispensary-stores.component';
import { DetailsDispensaryStoreComponent } from './stores/details/details-dispensary-store.component';
import { CreateDispensaryStoreComponent } from './stores/create/create-dispensary-store.component';
import { UpdateDispensaryStoreComponent } from './stores/update/update-dispensary-store.component';

import { AuthorizedDirective } from 'src/app/core/auth/auth.directive';

import { DispensaryAccountsComponent } from './accounts/dispensary-accounts.component';
import { DetailsDispensaryAccountComponent } from './accounts/details/details-dispensary-account.component';
import { CreateDispensaryAccountComponent } from './accounts/create/create-dispensary-account.component';
import { UpdateDispensaryAccountComponent } from './accounts/update/update-dispensary-account.component';

import { dispensaryProfileRoutes } from './dispensary-profile.routing';

@NgModule({
  declarations: [
    AuthorizedDirective,
    DispensaryProfileComponent,
    ViewDispensaryProfileComponent,
    UpdateDispensaryProfileComponent,
    DispensaryStoresComponent,
    DetailsDispensaryStoreComponent,
    CreateDispensaryStoreComponent,
    UpdateDispensaryStoreComponent,
    DispensaryAccountsComponent,
    DetailsDispensaryAccountComponent,
    CreateDispensaryAccountComponent,
    UpdateDispensaryAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dispensaryProfileRoutes),
    ReactiveFormsModule,
    PrimeNgModule,
    TabMenuModule,
    NgxSpinnerModule
  ]
})
export class DispensaryProfileModule { }
