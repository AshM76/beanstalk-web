import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';

import { ContestListComponent } from './contest-list.component';
import { ContestDetailComponent } from './contest-detail.component';
import { contestsRoutes } from './contests.routing';

@NgModule({
    declarations: [ContestListComponent, ContestDetailComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(contestsRoutes),
        PrimeNgModule
    ]
})
export class ContestsModule {}
