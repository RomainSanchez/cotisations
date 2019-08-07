import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.sass']
})
export class MatchesComponent implements OnInit {
  @Output() matchPayments = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];

  displayedColumns: any = [
    'select',
    'date',
    'value',
    'label',
    'credit',
    'disburse'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  selection: SelectionModel<Payment> = new SelectionModel<Payment>(true, []);

  isLoading = false;

  constructor(
    private paymentApi: PaymentApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  public openConfirmationDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Voulez vous vraiment décaisser ce virement ?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.disburse(payment);
      }
    });
  }

  public doFilter(value: string): void {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public isAllSelected() {
    return this.selection.selected.length === this.tableDataSource.data.length;
  }

  public disburseSelection() {
    this.selection.selected.forEach((payment: Payment) => this.disburse(payment));
    this.selection.clear();
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear():
      this.tableDataSource.data.forEach(row => this.selection.select(row))
    ;
  }

  private getPayments(): void {
    this.isLoading = true;

    this.paymentApi.getMatched().subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;

      this.isLoading = false;
    });
  }

  private disburse (payment: Payment): void {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.replaceOrCreate(payment).subscribe(() => {
      this.snackBar.open('Décaissement effectué', null, {
        duration: 2000,
      //  verticalPosition: 'top'
      });
      this.getPayments();
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
