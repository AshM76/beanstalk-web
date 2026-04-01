import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { UserManagementComponent } from './user-management.component'

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
  },
]

@NgModule({
  declarations: [UserManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class UserManagementModule {}
