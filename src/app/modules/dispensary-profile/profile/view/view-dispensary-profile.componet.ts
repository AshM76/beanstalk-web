import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { DispensaryProfileService } from '../../dispensary-profile.service';
import { Dispensary } from 'src/app/core/dispensary/dispensary.types';

@Component({
    selector: 'app-view-dispensary-profile',
    templateUrl: 'view-dispensary-profile.componet.html'
})
export class ViewDispensaryProfileComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>(); 
    
    dispensary!: Dispensary;

    constructor(
        private _dispensaryProfileService: DispensaryProfileService
    ) { }

    /**
     * On init
     */
    ngOnInit() {

        // Get the dispensary
        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dispensary: Dispensary) => {
                this.dispensary  = dispensary;
            }); 
    }

    /**
     * On destroy
     */
     ngOnDestroy(): void
     {
         // Unsubscribe from all subscriptions
         this._unsubscribeAll.next(null);
         this._unsubscribeAll.complete();
     }
}