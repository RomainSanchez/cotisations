import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunitiesComponent } from './communities/communities.component';
import { MatchComponent } from './match/match.component';
import { MatchesComponent } from './matches/matches.component';
import { AccountComponent } from './account/account.component';
import { CommunityResolver } from './account/community-resolver.service';
import { ErrorsComponent } from './errors/errors.component';
import { RibsComponent } from './ribs/ribs.component';
import { UnknownComponent } from './unknown/unknown.component';
import { InvalidComponent } from './invalid/invalid.component';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full'},
  { path: 'communities', component: CommunitiesComponent },
  { path: 'match', component: MatchComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'errors', component: ErrorsComponent },
  { path: 'ribs', component: RibsComponent },
  { path: 'unknown', component: UnknownComponent },
  { path: 'invalid', component: InvalidComponent },
  { path: 'account/:communityId',
    component: AccountComponent,
    resolve: {community: CommunityResolver}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CommunityResolver]
})
export class AppRoutingModule { }
