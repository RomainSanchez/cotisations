import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunitiesComponent } from './communities/communities.component';
import { MatchComponent } from './match/match.component';
import { MatchesComponent } from './matches/matches.component';

const routes: Routes = [
  { path: 'communities', component: CommunitiesComponent },
  { path: 'match', component: MatchComponent },
  { path: 'matches', component: MatchesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
