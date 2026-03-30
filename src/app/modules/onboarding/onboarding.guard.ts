import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { OnboardingService } from './onboarding.service';

@Injectable({providedIn: 'root'})
export class OnboardingGuard implements CanActivate {
    constructor(private _onboardingService: OnboardingService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        return !!this._onboardingService.AccountData;
    }
}