import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { LoopBackConfig } from '../shared/sdk/lb.config';
import { Debt } from '../shared/sdk/models/index';
import { DebtApi } from '../shared/sdk/services/index';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.sass']
})
export class DebtsComponent implements OnInit {
  @Output() matchDebts = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any = [
    'date',
    'community',
    'basis',
    'type',
    'amount'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  tableDataSource: MatTableDataSource<Debt>;
  debts: Debt[] = [];
  selectedDebts: Debt[] = [];
  isLoading = false;

  constructor(
    private debtApi: DebtApi,
    private http: HttpClient
  ) {
    this.tableDataSource = new MatTableDataSource<Debt>();
  }

  ngOnInit() {
    this.getDebts();
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  getDebts() {
    this.isLoading = true;

    this.debtApi.find({
      limit: 100,
      include: { relation: "community" }
    }).subscribe((debts: Debt[]) => {
      this.debts = debts;
      this.tableDataSource.data = this.debts;

      this.isLoading = false;
    });
  }

  updateDebts() {
    this.isLoading = true;

    this.http.get(`${LoopBackConfig.getPath()}/debts/retrieve`).subscribe(data => {
      this.getDebts();
    });
  }

  doFilter = (value: string) => {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  rowClicked(debt: Debt) {
    let key: number = this.isDebtSelected(debt);

    if(key !== -1 ) {
      delete this.selectedDebts[key];

      this.selectedDebts = this.selectedDebts.filter((theDebt) => {
        return theDebt !== null;
      });
    } else {
      this.selectedDebts.push(debt);
    }

    this.matchDebts.emit(this.selectedDebts);
  }

  isDebtSelected(debt: Debt): number {
    let key: number = -1;

    this.selectedDebts.forEach((theDebt, theKey) => {
      if(theDebt.id === debt.id) {
        key = theKey;
      }
    });

    return key;
  }

}
