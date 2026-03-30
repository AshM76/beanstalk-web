import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    name: string = 'Dispensary';

    constructor(private _dispensaryService: DispensaryService) { }

    ngOnInit(): void {
        this.name = this._dispensaryService.dispensaryName;
    }
}