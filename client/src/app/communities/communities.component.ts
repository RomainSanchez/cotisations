import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Community } from '../shared/sdk/models/index';
import { CommunityApi } from '../shared/sdk/services/index';
import { LoopBackConfig } from '../shared/sdk';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.sass']
})
export class CommunitiesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'agirheCode',
    'siret',
    'label'
  ];
  pageSize = 10;
  pageSizeOptions = [5, 10, 20, 50, 100];

  tableDataSource: MatTableDataSource<Community>;
  selectedcommunity: Community;
  isLoading = false;

  constructor(
    private communityApi: CommunityApi,
    private http: HttpClient
  ) {
    this.tableDataSource = new MatTableDataSource<Community>();
  }

  ngOnInit() {
    this.getCommunities();
  }

  ngAfterViewInit() {
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;
  }

  getCommunities() {
    this.isLoading = true;

    return this.communityApi.find({
      limit: 100
    })
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

  rowClicked(community: Community) {
    console.log(community);
  }

}
