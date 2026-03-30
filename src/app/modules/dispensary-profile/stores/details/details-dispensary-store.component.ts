import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryProfileService } from '../../dispensary-profile.service';
import { Store } from 'src/app/core/dispensary/dispensary.types';

@Component({
    selector: 'app-details-dispensary-store',
    templateUrl: 'details-dispensary-store.component.html',
    styleUrls: ['./details-dispensary-store.component.css']
})
export class DetailsDispensaryStoreComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    store!: Store;
    days: string[] = [];

    constructor(
        private _activateRoute: ActivatedRoute,
        private _spinnerService: NgxSpinnerService,
        private _dispensaryProfileService: DispensaryProfileService
    ) { }

    /**
     * On destroy
     */
    ngOnInit() {
        const storeId = this._activateRoute.snapshot.paramMap.get('id') as string;

        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        this._spinnerService.show();

        this._dispensaryProfileService.getStoreDetail(storeId).subscribe(response => {
            this._spinnerService.hide();
        });

        this._dispensaryProfileService.store$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((store: Store) => {
                
                this.store = store;
                this.store.store_hours = this.days.map(day => {
                    const hour = store.store_hours.find(h => h.day === day);
                    return {
                        day: day,
                        selected_day: !!hour,
                        opensAt: hour?.opensAt ?? '',
                        closesAt: hour?.closesAt ?? ''
                    };
                })
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}