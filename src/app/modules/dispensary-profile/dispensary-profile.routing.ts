import { Routes } from '@angular/router';

import { DispensaryProfileComponent } from './dispensary-profile.component';
import { UpdateDispensaryProfileComponent } from './profile/update/update-dispensary-profile.componet';
import { ViewDispensaryProfileComponent } from './profile/view/view-dispensary-profile.componet';

import { DispensaryStoresComponent } from './stores/dispensary-stores.component';
import { DispensaryAccountsComponent } from './accounts/dispensary-accounts.component';

import { DetailsDispensaryStoreComponent } from './stores/details/details-dispensary-store.component';
import { CreateDispensaryStoreComponent } from './stores/create/create-dispensary-store.component';
import { UpdateDispensaryStoreComponent } from './stores/update/update-dispensary-store.component';

import { DetailsDispensaryAccountComponent } from './accounts/details/details-dispensary-account.component';
import { CreateDispensaryAccountComponent } from './accounts/create/create-dispensary-account.component';
import { UpdateDispensaryAccountComponent } from './accounts/update/update-dispensary-account.component';

export const dispensaryProfileRoutes: Routes = [
  {
    path: '',
    component: DispensaryProfileComponent,
    children: [
      {
        path: 'profile',
        component: ViewDispensaryProfileComponent,
      },
      {
        path: 'profile/update',
        component: UpdateDispensaryProfileComponent
      },
      {
        path: 'stores',
        component: DispensaryStoresComponent
      }, 
      {
        path: 'stores/add',
        component: CreateDispensaryStoreComponent
      },
      {
        path: 'stores/:id',
        component: DetailsDispensaryStoreComponent
      },       
      {
        path: 'stores/:id/edit',
        component: UpdateDispensaryStoreComponent
      }, 
      {
        path: 'accounts',
        component: DispensaryAccountsComponent
      },
      {
        path: 'accounts/add',
        component: CreateDispensaryAccountComponent
      },
      {
        path: 'accounts/:id',
        component: DetailsDispensaryAccountComponent
      },
      {
        path: 'accounts/:id/edit',
        component: UpdateDispensaryAccountComponent
      }]
  }
];
