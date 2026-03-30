import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routing';

@NgModule({
    declarations: [DashboardComponent],
    imports: [ 
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        PrimeNgModule 
    ]
})
export class DashboardModule { }
