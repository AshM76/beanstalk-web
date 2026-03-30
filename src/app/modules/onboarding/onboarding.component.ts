import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styles: [
  ]
})
export class OnboardingComponent implements OnInit {

  constructor() { }
  steps: MenuItem[] = [];

  ngOnInit() {
    
    this.steps = [{
      label: 'Information',
      routerLink: 'step1'
    },
    {
      label: 'Store',
      routerLink: 'step2'
    },
    {
      label: 'RRSS',
      routerLink: 'step3'
    },
    {
      label: 'Agreements',
      routerLink: 'step4'
    }];
  }

}
