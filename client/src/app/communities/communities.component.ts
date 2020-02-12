import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Community } from '../shared/sdk/models/index';
import { CommunityApi } from '../shared/sdk/services/index';
import { LoopBackConfig } from '../shared/sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.sass']
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'siret',
    'label',
    'agirheCode'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];
  tableDataSource: MatTableDataSource<Community>;
  selectedcommunity: Community;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private communityApi: CommunityApi
  ) {
    this.tableDataSource = new MatTableDataSource<Community>();
  }

  ngOnInit() {
    this.getCommunities();
    this.tableDataSource.filterPredicate = this.filter;
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  getCommunities() {
    this.isLoading = true;

    return this.communityApi.find()
    .subscribe((communities: Community[]) => {
      this.tableDataSource.data = communities;

      this.isLoading = false;
    });
  }

  updateCommunities() {
    this.isLoading = true;

    this.http.get(`${LoopBackConfig.getPath()}/communities/retrieve`).subscribe(data => {
      this.getCommunities();
    });
  }

  doFilter = (value: string) => {
    this.tableDataSource.filter = value.trim().toLocaleLowerCase();
  }

  rowClicked(communityId: number) {
    this.router.navigate(['/account', communityId]);
  }

  export() {
    const data = [];
    const format = 'DD/MM/YYYY';

    this.paidDebtDataSource.data.forEach((debt: Debt) => {
      debt.payments.forEach((payment: Payment) => {
        if (payment.disbursedAt !== null) {
          console.log(moment(payment.disbursedAt).format('D/M/YYYY'))
          data.push({
            Période: debt.date,
            Collectivité: debt.community.label,
            Montant: payment.credit,
            'Date d\'encaissement': moment(payment.date).format(format),
            'Date de valeur': moment(payment.valueDate).format(format),
            'Date de décaissement': moment(payment.disbursedAt).format(format)
          });
        }
      });
    });

    this.exporter.export(data, `decaissements_${moment().format('DD-MM-YYYY')}`);
  }

  private filter(community: Community, filters: string) {
    const matchFilter = [];
    const filterArray = filters.split('+');

    const fields = Object.values(community).filter(Boolean);

    filterArray.forEach(filter => {
      const customFilter = [];

      fields.forEach(field => {
        if(typeof field === 'string') {
          customFilter.push(field.toLocaleLowerCase().includes(filter));
        }
      });
      matchFilter.push(customFilter.some(Boolean));
    });

    return matchFilter.every(Boolean);
  }

}
