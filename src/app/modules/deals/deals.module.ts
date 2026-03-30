import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PrimeNgModule } from '../../shared/prime-ng.module';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from "primeng/multiselect";
import { NgxSpinnerModule } from "ngx-spinner";

import { DealsComponent } from './deals.component';
import { DealDetailComponent } from './deal-detail/deal-detail.component';
import { DealPreviewComponent } from './deal-preview/deal-preview.component';
import { DealCreateComponent } from './deal-create/deal-create.component';
import { DealListComponent } from './deal-list/deal-list.component';
import { DealUpdateComponent } from './deal-update/deal-update.component';

import { dealsRoutes } from './deals.routing';

@NgModule({
  declarations: [
    DealsComponent,
    DealDetailComponent,
    DealPreviewComponent,
    DealCreateComponent,
    DealListComponent,
    DealUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(dealsRoutes),
    PrimeNgModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MessageModule,
    MultiSelectModule
  ]
})
export class DealsModule { } 
