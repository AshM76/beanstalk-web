import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';

import { PortfolioComponent } from './portfolio.component';

@NgModule({
    declarations: [PortfolioComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: PortfolioComponent }]),
        PrimeNgModule
    ]
})
export class PortfolioModule {}
