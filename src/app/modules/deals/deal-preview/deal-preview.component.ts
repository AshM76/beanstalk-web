import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-deal-preview',
    templateUrl: './deal-preview.component.html',
    styleUrls: ['../deals.component.css']
})
export class DealPreviewComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Input()
    deal!: { deal_typeOfDeal: string, deal_imageURL: string, deal_title: string, deal_offer: string, deal_amount: string };

    constructor( ) { }

    /**
     * On init
     */
    ngOnInit(): void {
        this.deal = { deal_typeOfDeal: '', deal_imageURL: '', deal_title: '', deal_offer: '', deal_amount: '' };
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
