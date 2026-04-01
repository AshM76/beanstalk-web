import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ComplianceComponent } from './compliance.component'

const routes: Routes = [
  {
    path: '',
    component: ComplianceComponent,
  },
]

@NgModule({
  declarations: [ComplianceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class ComplianceModule {}
