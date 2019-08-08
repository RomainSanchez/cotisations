import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { LabelValidatorService } from '../services/label-validator.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.sass']
})
export class PaymentsComponent implements OnInit {
  @Output() matchPayments = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any = [
    'date',
    'value',
    'label',
    'debit',
    'credit'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];
  private selectedPayments: Payment[] = [];

  isLoading = false;

  constructor(
    private paymentApi: PaymentApi,
    private labelValidator: LabelValidatorService

  ) {
    this.tableDataSource = new MatTableDataSource<Payment>();
  }

  ngOnInit() {
    this.getPayments();
    this.tableDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  doFilter = (value: string) => {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  rowClicked(payment: Payment) {
    let key:number = this.isPaymentSelected(payment);

    if(key !== -1 ) {
      delete this.selectedPayments[key];

      this.selectedPayments = this.selectedPayments.filter((thePayment) => {
        return thePayment !== null;
      });
    } else {
      this.selectedPayments.push(payment);
    }

    this.matchPayments.emit(this.selectedPayments);
  }

  uploadStarted() {
    this.isLoading = true;
  }

  uploadDone() {
    this.getPayments();
  }

  isPaymentSelected(payment: Payment): number {
    let key: number = -1;

    this.selectedPayments.forEach((thePayment, theKey) => {
      if(thePayment.id === payment.id) {
        key = theKey;
      }
    });

    return key;
  }

  clear() {
    this.selectedPayments = [];

    this.getPayments();
  }

  private getPayments() {
    this.isLoading = true;

    this.paymentApi.getUnmatched().subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;

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
