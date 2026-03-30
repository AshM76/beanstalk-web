import { Routes } from "@angular/router";

import { DealsComponent } from "./deals.component";
import { DealListComponent } from "./deal-list/deal-list.component";
import { DealDetailComponent } from "./deal-detail/deal-detail.component";
import { DealCreateComponent } from "./deal-create/deal-create.component";

export const dealsRoutes: Routes = [
  {
    path: '',
    component: DealsComponent,
    children:[
      {
        path: '',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: DealListComponent,
      },
      {
        path: 'detail/:id',
        component: DealDetailComponent,
      },
      {
        path: 'create',
        component: DealCreateComponent,
      },
      {
        path: 'edit/:id',
        component: DealCreateComponent,
      },
      {
        path: 're-publish/:id',
        component: DealCreateComponent,
      }
    ]
  }
];
