import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SDKBrowserModule } from 'src/app/shared/sdk/index';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MaterialComponentsModule } from './material-components/material-components.module';
import { MatchComponent } from './match/match.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    DashboardComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SDKBrowserModule.forRoot(),
    MaterialComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
