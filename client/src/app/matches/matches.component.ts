import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.sass']
})
export class MatchesComponent implements OnInit {
  @Output() matchPayments = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private displayedColumns: any = [
    'date',
    'value',
    'label',
    'credit',
    'disburse'
  ];
  private pageSize = 10;
  private pageSizeOptions = [5, 10, 20, 50, 100];

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];

  isLoading = false;

  constructor(private paymentApi: PaymentApi) {
    this.tableDataSource = new MatTableDataSource<Payment>();
  }

  ngOnInit() {
    this.getPayments();
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  private getPayments() {
    this.isLoading = true;

    this.paymentApi.getMatched().subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;

      this.isLoading = false;
    });
  }

  public doFilter(value: string) {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public disburse (payment: Payment) {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.getPayments();
    });
  }

}
