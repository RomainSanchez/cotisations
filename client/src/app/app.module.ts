import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SDKBrowserModule } from 'src/app/shared/sdk/index';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularSplitModule } from 'angular-split';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MatchComponent } from './match/match.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DebtsComponent } from './debts/debts.component';
import { PaymentsComponent } from './payments/payments.component';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';
import { CommunitiesComponent } from './communities/communities.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    DashboardComponent,
    DebtsComponent,
    PaymentsComponent,
    CsvUploadComponent,
    CommunitiesComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SDKBrowserModule.forRoot(),
    MaterialComponentsModule,
    AngularSplitModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
