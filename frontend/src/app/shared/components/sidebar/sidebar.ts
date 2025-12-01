import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  isSpecial?: boolean;
  adminOnly?: boolean;
  requiresAuth?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  private auth = inject(Auth);

  // Acceder al valor del signal currentUser()
  get isAdmin(): boolean {
    return this.auth.currentUser()?.rol === 'administrador';
  }

  // Verificar si el usuario está autenticado
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  navItems: NavItem[] = [
    { icon: 'home', label: 'Inicio', route: '/dashboard' },
    ...(this.isAdmin ? [] : [
      { icon: 'explore', label: 'Explorar', route: '/explore' },
      { icon: 'community', label: 'Comunidad', route: '/community' },
      {
        icon: 'stories',
        label: 'Tus historias',
        route: '/stories',
        requiresAuth: true
      },
      {
        icon: 'favorites',
        label: 'Favoritos',
        route: '/favorites',
        requiresAuth: true
      },
    ]),
    {
      icon: 'loans',
      label: 'Préstamos',
      route: '/loans',
      requiresAuth: true
    }
  ];

  get filteredNavItems(): NavItem[] {
    return this.navItems.filter(item => {
      if (item.requiresAuth && !this.isLoggedIn) {
        return false;
      }
      return true;
    });
  }

  configItems = [
    { icon: 'settings', label: 'Configuración', route: '/settings' },
    { icon: 'help', label: 'Ayuda', route: '/help' }
  ];
}
