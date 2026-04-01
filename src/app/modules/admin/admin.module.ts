import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { AdminComponent } from './admin.component'
import { adminRoutes } from './admin.routing'

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule.forChild(adminRoutes)],
})
export class AdminModule {}
