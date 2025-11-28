import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Explore } from './pages/explore/explore';
import { Favorites } from './pages/favorites/favorites';
import { AuthorProfileData } from './pages/author-profile/author-profile';
import { Community } from './pages/community/community';
import { Stories } from './pages/my-storys/my-storys';
import { CreateStory } from './pages/create-story/create-story';
import { CreateChapter } from './pages/create-chapter/create-chapter';
import { authGuard, guestGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'explore',
    component: Explore
  },

  {
    path: 'favorites',
    component: Favorites
  },

  {
    path: 'author-profile/:id',
    component: AuthorProfileData
    path: 'community',
    component: Community
    path: 'stories',
    component: Stories
  },

  {
    path: 'create-story',
    component: CreateStory
  },

  {
    path: 'create-chapter/:id',
    component: CreateChapter
  },

  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
