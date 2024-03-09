import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { TournamentDetailsComponent } from './components/tournament-details/tournament-details.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { NewsComponent } from './components/news/news.component';
import { ContactComponent } from './components/contact/contact.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TermsComponent } from './components/terms/terms.component';
import { PolicyComponent } from './components/policy/policy.component';

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
  },
  {
    path: 'blogs',
    component: BlogsComponent
  },
  {
    path: 'blogs/:id',
    component: BlogDetailsComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsComponent
  },
  {
    path: 'privacy-policy',
    component: PolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
