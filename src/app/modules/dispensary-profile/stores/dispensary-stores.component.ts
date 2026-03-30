import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Dispensary, Store } from 'src/app/core/dispensary/dispensary.types';
import { environment } from 'src/environments/environment';
import { DispensaryProfileService } from '../dispensary-profile.service';

@Component({
    selector: 'app-dispensary-stores',
    templateUrl: 'dispensary-stores.component.html',
    styleUrls: ['./dispensary-stores.component.css']
})
export class DispensaryStoresComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    stores: Store[] = [];

    constructor(
        private _dispensaryProfileService: DispensaryProfileService
    ) { }

    /**
     * On init
     */
    ngOnInit() {

        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dispensary: Dispensary) => {                
                this.stores = dispensary.dispensary_stores.map(store => {
                    return {
                        ...store,
                        store_photos: store.store_photos?.map((photo: { photo_url: string }) => {
                            return { photo_url: `${environment.resourcesUrl}${photo.photo_url}` }
                        }) ?? []
                    }
                });
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
