import { NgModule } from '@angular/core';

//PrimeNg
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {ScrollPanelModule} from 'primeng/scrollpanel';

//menu
import {MenubarModule} from 'primeng/menubar';
import {MenuModule} from 'primeng/menu';

//message
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import {AvatarModule} from 'primeng/avatar';

import {StepsModule} from 'primeng/steps';

import {ProgressSpinnerModule} from 'primeng/progressspinner';

import {ToggleButtonModule} from 'primeng/togglebutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {InputMaskModule} from 'primeng/inputmask';


import {RippleModule} from 'primeng/ripple';

import {DropdownModule} from 'primeng/dropdown';
import {SelectButtonModule} from 'primeng/selectbutton';

import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {FieldsetModule} from 'primeng/fieldset';

import {CalendarModule} from 'primeng/calendar';

import {FileUploadModule} from 'primeng/fileupload';
import {ImageModule} from 'primeng/image';

import {BadgeModule} from 'primeng/badge';

import {TableModule} from 'primeng/table';
import {ChipModule} from 'primeng/chip';

import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ToolbarModule} from 'primeng/toolbar';

import {TabViewModule} from 'primeng/tabview';

@NgModule({
  exports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    MenubarModule,
    MenuModule,
    InputTextareaModule,
    MessageModule,
    MessagesModule,
    CheckboxModule,
    ScrollPanelModule,
    AvatarModule,
    StepsModule,
    ProgressSpinnerModule,
    ToggleButtonModule,
    RippleModule,
    InputSwitchModule,
    InputMaskModule,
    DropdownModule,
    SelectButtonModule,
    DynamicDialogModule,
    FieldsetModule,
    CalendarModule,
    FileUploadModule,
    ImageModule,
    BadgeModule,
    TableModule,
    ChipModule,
    ToolbarModule,
    BreadcrumbModule,
    TabViewModule
  ]
})
export class PrimeNgModule { }
