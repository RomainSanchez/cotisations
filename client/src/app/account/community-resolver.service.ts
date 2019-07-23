import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CommunityApi, Community } from '../shared/sdk';

@Injectable()
export class CommunityResolver implements Resolve<any> {
  constructor(private communityApi: CommunityApi) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Community[]> {
    const communityId = route.params.communityId;

    return this.communityApi.findOne({
      where: {
        id: communityId
      }
    });
  }
}
