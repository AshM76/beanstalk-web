import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { CloudStorageService } from 'src/app/core/cloud/cloud-storege.service';
import { DispensaryProfileService } from '../../dispensary-profile.service';

import { States } from 'src/app/data/states';

@Component({
    selector: 'app-create-dispensary-store',
    templateUrl: 'create-dispensary-store.component.html'
})
export class CreateDispensaryStoreComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dispensaryStoreForm!: FormGroup;

    states: string[] = [];
    days: string[] = [];

    imageFile: File = new File([], '');
    uploadedFiles: any = [];
    uploadedFileUrl: SafeUrl = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private _spinnerService: NgxSpinnerService,
        private _cloudStorageService: CloudStorageService,
        private _dispensaryProfileService: DispensaryProfileService
    ) { }

    ngOnInit() {
        this.states = States;

        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        this.dispensaryStoreForm = this._formBuilder.group({
            store_id: [''],
            store_name: ['', [Validators.required]],
            store_description: [''],
            store_phone: [''],
            store_email: ['', [Validators.email]],
            store_addressLine1: ['', [Validators.required]],
            store_addressLine2: [''],
            store_city: ['', [Validators.required]],
            store_state: ['', [Validators.required]],
            store_zip: ['', [Validators.required]],
            store_website: [''],
            store_facebook: [''],
            store_instagram: [''],
            store_twitter: [''],
            store_youtube: [''],
            store_available: [false],
            store_photos: [],
            store_hours: this._formBuilder.array([])
        });

        this.days.forEach(day => {
            this.dispensaryStoreOpenHours.push(this._formBuilder.group(
                {
                    day: [day],
                    selected_day: [false],
                    opensAt: [{ value: '', disabled: true }, [Validators.required]],
                    closesAt: [{ value: '', disabled: true }, [Validators.required]]
                })
            );
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

    saveStoreData(): void {

        this._spinnerService.show();

        this._cloudStorageService.uploadImage(this.imageFile, 'stores').subscribe(response => {
            if (!response.error) {
                this.dispensaryStoreForm.patchValue({
                    store_photos: [{ 'photo_url': response['url'] }]
                });
            }

            this._dispensaryProfileService.saveStoreData(this.dispensaryStoreForm.value).subscribe(response => {
                this._spinnerService.hide();

                this._router.navigateByUrl('/dispensary/stores/' + response.store_id);

            });
        });
    }

    get dispensaryStoreOpenHours(): FormArray {
        return this.dispensaryStoreForm.controls["store_hours"] as FormArray;
    }

    handleStoreOpenHourChange(condition: boolean, index: number): void {
        const action = condition ? 'enable' : 'disable';
        const control = this.dispensaryStoreOpenHours.get([index]) as FormGroup;
        control.controls['opensAt'][action]();
        control.controls['closesAt'][action]();
    }

    onUploadImage(event: any) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
            this.uploadedFileUrl = this._sanitizer.bypassSecurityTrustUrl(file['objectURL']['changingThisBreaksApplicationSecurity']);
            this.imageFile = file;
        }
    }

    clearUploadImage() {
        this.uploadedFileUrl = '';
    }
}