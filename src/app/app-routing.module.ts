import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'about-us',
    component: AboutComponent
  },
  {
    path: 'tournament',
    component: TournamentsComponent
  },
  {
    path: 'tournament/:id',
    component: TournamentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
