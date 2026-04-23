import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/shared/prime-ng.module';

import { TradingComponent } from './trading.component';

@NgModule({
    declarations: [TradingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: TradingComponent }]),
        PrimeNgModule
    ]
})
export class TradingModule {}
