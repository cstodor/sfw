import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamResolver } from './team.resolver';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamMediaComponent } from './team-media/team-media.component';
import { FameTeamComponent } from './fame-team/fame-team.component';

export const teamRoutes: Routes = [
  {
    path: '',
    component: TeamsComponent,
    pathMatch: 'full'
  },
  {
    path: 'edit/:teamId',
    component: TeamEditComponent,
    resolve: {
      team: TeamResolver
    }
  },
  {
    path: 'detail/:teamId',
    component: TeamDetailComponent,
    resolve: {
      team: TeamResolver
    }
  },
  {
    path: 'fame',
    component: FameTeamComponent
  },
  {
    path: 'media',
    component: TeamMediaComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];


