import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatComponent } from './chat.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { chatRoutes } from './chat.routing';
import { PrimeNgModule } from '../../shared/prime-ng.module';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(chatRoutes),
    FormsModule,
    NgxSpinnerModule,
    PrimeNgModule,
  ]
})
export class ChatModule { }
