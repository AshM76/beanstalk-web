import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { States } from 'src/app/data/states';

import { OnboardingService } from 'src/app/modules/onboarding/onboarding.service';


@Component({
    selector: 'app-onboarding-step2',
    templateUrl: './step2.component.html'
})
export class Step2Component implements OnInit {

    dispensaryStoreForm!: FormGroup;

    states: string[] = [];
    days: string[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _onboardingService: OnboardingService,
    ) {
    }

    ngOnInit(): void {
        this.states = States;
        this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        this.dispensaryStoreForm = this._formBuilder.group({
            store_name: [this._onboardingService.MainStoreData?.store_name??'', [Validators.required]],
            store_description: [this._onboardingService.MainStoreData?.store_description??''],
            store_phone: [this._onboardingService.MainStoreData?.store_phone??''],
            store_email: [this._onboardingService.MainStoreData?.store_email??''],
            store_addressLine1: [this._onboardingService.MainStoreData?.store_addressLine1??'', [Validators.required]],
            store_addressLine2: [this._onboardingService.MainStoreData?.store_addressLine2??''],
            store_city: [this._onboardingService.MainStoreData?.store_city??'', [Validators.required]],
            store_state: [this._onboardingService.MainStoreData?.store_state??'', [Validators.required]],
            store_zip: [this._onboardingService.MainStoreData?.store_zip??'', [Validators.required]],
            store_hours: this._formBuilder.array([])
        });
        
        this.days.forEach(day => {
            const storeHour = this._onboardingService.MainStoreData?.store_hours.find(hour => hour.day == day);
            const storeHourSelected = storeHour?.selected_day

            this.dispensaryStoreOpenHours.push(this._formBuilder.group(
                {
                    day: [day],
                    selected_day: [storeHourSelected],
                    opensAt: [{ value: storeHour?.opensAt, disabled: !storeHourSelected }, [Validators.required] ],
                    closesAt: [{ value: storeHour?.closesAt, disabled: !storeHourSelected }, [Validators.required] ]
                })
            );
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

    nextPage(): void {
        if (this.dispensaryStoreForm.valid) {
            this._onboardingService.MainStoreData = this.dispensaryStoreForm.value;
            
            this._router.navigateByUrl('onboarding/step3');
        }
    }

    backPage(): void {
        this._router.navigateByUrl('onboarding/step1');
    }

}
