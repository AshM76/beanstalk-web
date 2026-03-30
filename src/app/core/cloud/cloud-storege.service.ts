import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { StorageUploadResponse } from './cloud.types';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CloudStorageService {

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    /**
     * Save image store
     */
    uploadImage(file: File, bucket: string): Observable<StorageUploadResponse> {

        console.log("::CloudStorage/UploadFile");
        console.log(file);

        if (file.size) {
            const url = `${environment.baseUrl}/cloudstorage/upload`;

            const formData: FormData = new FormData();
            formData.append('file', file);
            formData.append('bucket', bucket);

            return this._httpClient.post<StorageUploadResponse>(url, formData)
                .pipe(
                    map(resp => resp),
                    catchError(err => of(err))
                );
        } else {
            return of({ error: true, message: 'Trying to upload an empty image.', url: '' });
        }
    }
}