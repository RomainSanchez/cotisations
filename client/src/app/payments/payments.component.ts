import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.sass']
})
export class PaymentsComponent implements OnInit {
  @Output() selectedPayment= new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private displayedColumns: any = [
    'date',
    'value',
    'label',
    'debit',
    'credit',
    'select'
  ];
  private pageSize = 10;
  private pageSizeOptions = [5, 10, 20, 50, 100];

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];

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
    this.paymentApi.find().subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;
    });
  }

  public doFilter = (value: string) => {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public rowClicked(payment: Payment) {
    this.selectedPayment.emit(payment);
  }

  public isLabelValid (label: string) {
    const regularExpressions = [
      new RegExp('COTIS_\\d{4}_\\d{2}_d{14}', 'i'),
      new RegExp('COTIS\\s\\d{4}\\s\\d{2}\\s\\d{14}', 'i')
    ];

    return (label && label !== ' ' && label !== 'Libellé') &&
      (label.match(regularExpressions[0]) || label.match(regularExpressions[1]));
  }

}
