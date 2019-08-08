import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import * as moment from 'moment';

import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { LabelValidatorService } from '../services/label-validator.service';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.sass']
})
export class ErrorsComponent implements OnInit {
  @Output() matchPayments = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];

  displayedColumns: any = [
    //'select',
    'date',
    'value',
    'label',
    'credit',
    'matched'
  ];
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  selection: SelectionModel<Payment> = new SelectionModel<Payment>(true, []);
  exportSheetName: string = 'Feuille1';
  exportFileName: string = 'erreur-libellés';
  ratio: number;

  isLoading = false;

  constructor(
    private paymentApi: PaymentApi,
    private labelValidator: LabelValidatorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    moment.locale('fr');
    this.tableDataSource = new MatTableDataSource<Payment>();
    this.exportFileName = `${this.exportFileName}-${moment().format('DD-MM-Y')}`;
  }

  ngOnInit() {
    this.getPayments();
    this.tableDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  // public openConfirmationDialog(payment: Payment): void {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '350px',
  //     data: "Voulez vous vraiment envoyer les emails aux collectivités ?"
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result) {
  //       // TODO send emails
  //     }
  //   });
  // }

  public doFilter(value: string): void {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  // public isAllSelected() {
  //   return this.selection.selected.length === this.tableDataSource.data.length;
  // }

  // public exportSelection() {
  //   this.selection.selected.forEach((payment: Payment) => this.disburse(payment));
  //   this.selection.clear();
  // }

  // public masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear():
  //     this.tableDataSource.data.forEach(row => this.selection.select(row))
  //   ;
  // }

  private getPayments(): void {
    this.isLoading = true;

    this.paymentApi.find({
      where: {
        credit: {
          neq: null
        }
      },
      include: ['debts']
    }).subscribe((payments: Payment[]) => {
      const total = payments.length;
      this.payments = payments.filter(payment => !this.labelValidator.isValid(payment.label));
      this.tableDataSource.data = this.payments;

      this.ratio = Math.round(this.payments.length / total * 100);

      this.isLoading = false;
    });
  }

  private filter(payment: Payment, filters) {
    const matchFilter = [];
    const filterArray = filters.split('+');

    delete payment.debts;
    delete payment.id;

    const fields = Object.values(payment).filter(Boolean);

    filterArray.forEach(filter => {
      const customFilter = [];

      fields.forEach(field => {
        customFilter.push(field.toLowerCase().includes(filter))
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }

}
