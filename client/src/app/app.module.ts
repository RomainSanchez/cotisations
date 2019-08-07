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
import { AngularDraggableModule } from 'angular2-draggable';
import { MatTableExporterModule } from 'mat-table-exporter';

import { MatchComponent } from './match/match.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DebtsComponent } from './debts/debts.component';
import { PaymentsComponent } from './payments/payments.component';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';
import { CommunitiesComponent } from './communities/communities.component';
import { Siret } from './communities/siret.pipe';
import { MatchesComponent } from './matches/matches.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AccountComponent } from './account/account.component';
import { ErrorsComponent } from './errors/errors.component';

@NgModule({
  declarations: [
    AppComponent,
    MatchComponent,
    DashboardComponent,
    DebtsComponent,
    PaymentsComponent,
    CsvUploadComponent,
    CommunitiesComponent,
    Siret,
    MatchesComponent,
    ConfirmationDialogComponent,
    AccountComponent,
    ErrorsComponent
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
    AngularSplitModule.forRoot(),
    AngularDraggableModule,
    MatTableExporterModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
