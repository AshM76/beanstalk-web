import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

import { DispensaryProfileService } from '../../dispensary-profile.service';
import { Dispensary } from 'src/app/core/dispensary/dispensary.types';
import { CloudStorageService } from 'src/app/core/cloud/cloud-storege.service';

@Component({
    selector: 'app-update-dispensary-profile',
    templateUrl: 'update-dispensary-profile.componet.html'
})
export class UpdateDispensaryProfileComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dispensaryProfileForm!: FormGroup;

    imageFile: File = new File([], '');
    uploadedFiles: any = [];
    uploadedFileUrl: SafeUrl = '';

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _sanitizer: DomSanitizer,
        private _spinnerService: NgxSpinnerService,
        private _cloudStorageService: CloudStorageService,
        private _dispensaryProfileService: DispensaryProfileService) { }

    /**
     * On init
     */
    ngOnInit() {
        this.dispensaryProfileForm = this._formBuilder.group({
            dispensary_name: ['', [Validators.required]],
            dispensary_description: ['', Validators.required],
            dispensary_license: [''],
            dispensary_logo: ['']
        });

        this._dispensaryProfileService.dispensary$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dispensary: Dispensary) => {
                this.uploadedFileUrl = dispensary.dispensary_logo ?? '';
                this.dispensaryProfileForm.patchValue(dispensary);
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

    /**
     * Update dispensary profile data
     */
    updateDispensaryProfile() {
        this._spinnerService.show();

        this._cloudStorageService.uploadImage(this.imageFile, 'dispensaries').subscribe(response => {
            if (!response.error) {
                this.dispensaryProfileForm.patchValue({
                    dispensary_logo: response['url']
                });
            }
            this._dispensaryProfileService.updateProfile(this.dispensaryProfileForm.value).subscribe(response => {
                this._spinnerService.hide();
                this._router.navigateByUrl('/dispensary/profile');
            });
        });

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