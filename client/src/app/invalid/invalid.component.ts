import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { Debt, DebtApi } from '../shared/sdk';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-invalid',
  templateUrl: './invalid.component.html',
  styleUrls: ['./invalid.component.sass']
})
export class InvalidComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private tableDataSource: MatTableDataSource<Debt>;
  private debts: Debt[];

  displayedColumns: any = [
    'date',
    'community',
    'basis',
    'type',
    'amount',
    'restore'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  selection: SelectionModel<Debt> = new SelectionModel<Debt>(true, []);

  isLoading = false;

  constructor(
    private debtApi: DebtApi,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.tableDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.getDebts();
    this.tableDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  public openConfirmationDialog(debt: Debt): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Voulez vous vraiment restaurer cette déclaration ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restore(debt);
      }
    });
  }

  public doFilter(value: string): void {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public isAllSelected() {
    return this.selection.selected.length === this.tableDataSource.data.length;
  }

  public restore(debt: Debt) {
    debt.invalid = false;

    this.debtApi.replaceById(debt.id, debt).subscribe(() => {
      this.getDebts();
    });
  }

  private getDebts(): void {
    this.isLoading = true;

    this.debtApi.find({
      include: ['community'],
      where: {
        invalid: true
      }
    }).subscribe((debts: Debt[]) => {
      this.debts = debts;
      this.tableDataSource.data = this.debts;

      this.isLoading = false;
    });
  }

  private filter(debt: Debt, filters) {
    const matchFilter = [];
    const filterArray = filters.split('+');

    const fields = Object.values(debt).filter(Boolean);

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
