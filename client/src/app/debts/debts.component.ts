import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource, MatPaginator, MatSort, DateAdapter } from '@angular/material';

import { LoopBackConfig } from '../shared/sdk/lb.config';
import { Debt } from '../shared/sdk/models/index';
import { DebtApi } from '../shared/sdk/services/index';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.sass']
})
export class DebtsComponent implements OnInit, AfterViewInit {
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
  fromPeriod: number = null;
  toPeriod: number;
  periods: Period[] = [
    {name: 'Janvier', value: 1},
    {name: 'Février', value: 2},
    {name: 'Mars', value: 3},
    {name: 'Avril', value: 4},
    {name: 'Mai', value: 5},
    {name: 'Juin', value: 6},
    {name: 'Juillet', value: 7},
    {name: 'Aout', value: 8},
    {name: 'Septembre', value: 9},
    {name: 'Octobre', value: 10},
    {name: 'Novembre', value: 11},
    {name: 'Décembre', value: 12}
  ];

  constructor(
    private debtApi: DebtApi,
    private http: HttpClient,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.tableDataSource = new MatTableDataSource<Debt>();
    this.dateAdapter.setLocale('fr');
  }

  ngOnInit() {
    this.getDebts();
    moment.locale('fr');
    this.toPeriod = moment().month() + 1;
    this.tableDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    // Allow sorting on nested property debt.community.label
    this.tableDataSource.sortingDataAccessor = (debt: Debt, property: string): string|number => {
      switch (property) {
        case 'community': return debt.community.label;
        default: return debt[property];
      }
    };
    this.tableDataSource.sort = this.sort;
  }

  updateDebts() {
    this.isLoading = true;

    this.http.get(`${LoopBackConfig.getPath()}/debts/retrieve`).subscribe(() => {
      this.getDebts();
    });
  }

  doFilter (value: string) {
    if(value !== 'DATE_RANGE_NO_FILTER') {
      this.tableDataSource.filter = value.trim().toLowerCase();

      return;
    }
    const currentFilter = this.tableDataSource.filter;

    // Hack to trigger filter update
    this.tableDataSource.filter = '------';
    this.tableDataSource.filter = currentFilter !== null ? currentFilter : ' ';
  }

  rowClicked(debt: Debt) {
    const key: number = this.isDebtSelected(debt);

    if (key !== -1 ) {
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
    let key = -1;

    this.selectedDebts.forEach((theDebt, theKey) => {
      if (theDebt.id === debt.id) {
        key = theKey;
      }
    });

    return key;
  }

  clear() {
    this.selectedDebts = [];

    this.getDebts();
  }

  removeLast() {
    this.selectedDebts.pop();
  }

  applyPeriod() {
    this.tableDataSource.data = this.debts.filter((debt: Debt) => {
      const debtMonth = parseInt(debt.date.split('/')[0]);

      if (this.fromPeriod !== null) {
        return debtMonth >= this.fromPeriod &&
          debtMonth <= this.toPeriod
        ;
      }

      return debtMonth <= this.toPeriod;
    });
  }

  private getDebts() {
    this.isLoading = true;

    this.debtApi.getUnmatched().subscribe((debts: Debt[]) => {
      this.debts = debts;
      this.tableDataSource.data = this.debts;
      this.isLoading = false;
    });
  }

  private filter = (debt: Debt, filters: any) => {
    const matchFilter = [];
    const filterArray = filters.split('+');
    const columns = [
      debt.agirheCode,
      debt.amount,
      debt.basis,
      debt.community.label,
      debt.community.siret,
      debt.date,
      debt.type
    ];

    filterArray.forEach(filter => {
      const customFilter = [];

      columns.forEach(column => {
        customFilter.push(column.toLowerCase().includes(filter));
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }

}

export interface Period {
  name: string;
  value: number;
}
