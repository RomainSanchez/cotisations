import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Moment } from 'moment';
import * as moment from 'moment';

import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { LabelValidatorService } from '../services/label-validator.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.sass']
})
export class PaymentsComponent implements OnInit, AfterViewInit {
  @Output() matchPayments = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any = [
    'date',
    'value',
    'label',
    'credit'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  fromDate: Moment;
  toDate: Moment = moment();

  tableDataSource: MatTableDataSource<Payment>;
  payments: Payment[];
  selectedPayments: Payment[] = [];

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

  doFilter(value: string): void {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  rowClicked(payment: Payment): void {
    const key: number = this.isPaymentSelected(payment);

    if (key !== -1 ) {
      delete this.selectedPayments[key];

      this.selectedPayments = this.selectedPayments.filter((thePayment) => {
        return thePayment !== null;
      });
    } else {
      this.selectedPayments.push(payment);
    }

    this.matchPayments.emit(this.selectedPayments);
  }

  uploadStarted(): void {
    this.isLoading = true;
  }

  uploadDone(): void {
    this.getPayments();
  }

  isPaymentSelected(payment: Payment): number {
    let key = -1;

    this.selectedPayments.forEach((thePayment, theKey) => {
      if (thePayment.id === payment.id) {
        key = theKey;
      }
    });

    return key;
  }

  clear(): void {
    this.selectedPayments = [];

    this.getPayments();
  }

  removeLast(): void {
    this.selectedPayments.pop();
  }

  applyPeriod(): void {
    this.tableDataSource.data = this.payments.filter((payment: Payment) => {
      const date = moment(payment.date, 'DD/MM/YYYY');

      if (this.fromDate) {
        return date.isSameOrAfter(this.fromDate) &&
          date.isSameOrBefore(this.toDate);
      }

      if (this.toDate) {
        return date.isSameOrBefore(this.toDate);
      }
    });
  }

  private getPayments(): void {
    this.isLoading = true;

    this.paymentApi.getUnmatched().subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;

      this.isLoading = false;
    });
  }

  private filter(payment: Payment, filters): boolean {
    const matchFilter = [];
    const filterArray = filters.split('+');

    delete payment.debts;

    const fields = Object.values(payment).filter(Boolean);

    filterArray.forEach(filter => {
      const customFilter = [];

      fields.forEach(field => {
        if (typeof field === 'string') {
          customFilter.push(field.toLowerCase().includes(filter));
        }
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }

}
