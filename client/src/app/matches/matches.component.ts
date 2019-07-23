import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar } from '@angular/material';
import { Payment } from '../shared/sdk/models/index';
import { PaymentApi } from '../shared/sdk/services/index';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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

  constructor(
    private paymentApi: PaymentApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tableDataSource = new MatTableDataSource<Payment>();
  }

  ngOnInit() {
    this.getPayments();
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

}
