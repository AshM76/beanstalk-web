import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from './shared/prime-ng.module';

import { LayoutModule } from './layout/layout.module';

import { AuthService } from './core/auth/auth.service';

import { AppComponent } from './app.component';

import { ApiErrorInterceptor } from './core/interceptors/api-error.interceptor';

import { routes } from './app.routing';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {useHash: true}),
    HttpClientModule,
    LayoutModule,
    PrimeNgModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiErrorInterceptor,
    multi: true
  }, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
