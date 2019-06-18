import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Debt } from '../shared/sdk/models/index';
import { DebtApi } from '../shared/sdk/services/index';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.sass']
})
export class DebtsComponent implements OnInit {
  @Output() selectedDebt = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private displayedColumns: any = [
    'date',
    'community',
    'basis',
    'type',
    'amount',
    'select'
  ];
  private pageSize = 10;
  private pageSizeOptions = [5, 10, 20, 50, 100];

  private tableDataSource: MatTableDataSource<Debt>;
  private debts: Debt[];

  constructor(private debtApi: DebtApi) {
    this.tableDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.getDebts();
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  private getDebts() {
    this.debtApi.find({
      limit: 100,
      include: { relation: "community" }
    }).subscribe((debts: Debt[]) => {
      this.debts = debts;
      this.tableDataSource.data = this.debts;
    });
  }

  public doFilter = (value: string) => {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  public rowClicked(debt: Debt) {
    this.selectedDebt.emit(debt);
  }

}
