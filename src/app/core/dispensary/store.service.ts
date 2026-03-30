import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DispensaryService } from './dispensary.service';

@Injectable({ providedIn: 'root' })
export class StoreService {

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient, 
        private _dispensaryService: DispensaryService
    ) {  }    
}
