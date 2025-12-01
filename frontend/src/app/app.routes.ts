import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Explore } from './pages/explore/explore';
import { Favorites } from './pages/favorites/favorites';
import { Loans } from './pages/loans/loans';
import { AuthorProfileData } from './pages/author-profile/author-profile';
import { Community } from './pages/community/community';
import { Stories } from './pages/my-storys/my-storys';
import { CreateStory } from './pages/create-story/create-story';
import { CreateChapter } from './pages/create-chapter/create-chapter';
import { Settings } from './pages/settings/settings';
import { Help } from './pages/help/help';
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
    component: Favorites,
    canActivate: [authGuard]
  },

  {
    path: 'loans',
    component: Loans,
    canActivate: [authGuard]
  },

  {
    path: 'author-profile/:id',
    component: AuthorProfileData,
    canActivate: [authGuard]
  },

  {
    path: 'community',
    component: Community
  },

  {
    path: 'stories',
    component: Stories,
    canActivate: [authGuard]
  },

  {
    path: 'create-story',
    component: CreateStory,
    canActivate: [authGuard]
  },

  {
    path: 'create-chapter/:id',
    component: CreateChapter,
    canActivate: [authGuard]
  },

  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard]
  },

  {
    path: 'help',
    component: Help
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
