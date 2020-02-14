import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Payment, PaymentApi } from '../shared/sdk';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-ribs',
  templateUrl: './ribs.component.html',
  styleUrls: ['./ribs.component.sass']
})
export class RibsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableDataSource: MatTableDataSource<Payment>;
  private payments: Payment[];
  exportSheetName = 'Feuille1';
  exportFileName = 'virements-mauvais-rib';

  displayedColumns: any = [
    'select',
    'date',
    'value',
    'label',
    'credit',
    'delete',
    'cancel'
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
      data: 'Voulez vous vraiment supprimer ce virement définitivement?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete(payment);
      }
    });
  }

  public doFilter(value: string): void {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public isAllSelected() {
    return this.selection.selected.length === this.tableDataSource.data.length;
  }

  public deleteSelection() {
    this.selection.selected.forEach((payment: Payment) => this.delete(payment));
    this.selection.clear();
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableDataSource.data.forEach(row => this.selection.select(row))
    ;
  }

  public cancel(payment: Payment) {
    payment.rib = false;

    this.paymentApi.replaceById(payment.id, payment).subscribe(() => {
      this.getPayments();
    });
  }

  private getPayments(): void {
    this.isLoading = true;

    this.paymentApi.find({
      where: {
        rib: true
      }
    }).subscribe((payments: Payment[]) => {
      this.payments = payments;
      this.tableDataSource.data = this.payments;

      this.isLoading = false;
    });
  }

  private delete(payment: Payment): void {
    payment.disbursedAt = new Date().toString();

    this.paymentApi.deleteById(payment.id).subscribe(() => {
      this.snackBar.open('Virement supprimé', null, {
        duration: 2000,
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
        if (typeof field === 'string') {
          customFilter.push(field.toLowerCase().includes(filter));
        }
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }
}
