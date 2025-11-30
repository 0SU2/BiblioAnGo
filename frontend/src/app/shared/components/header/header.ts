import { Component, Output, EventEmitter, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  logoPath: string = 'assets/libabu-logo.png';
  isLoggedIn: boolean = false;
  userInfo: any = null;
  showProfileMenu: boolean = false;
  showNotificationMenu: boolean = false;

  constructor(
    public authService: Auth,
    private router: Router
  ) {
    effect(() => {
      this.isLoggedIn = this.authService.isAuthenticated();
      this.userInfo = this.authService.currentUser();
    });
  }

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.userInfo = this.authService.currentUser();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleProfileMenu() {
    if (!this.isLoggedIn) {
      // Si no está loggeado, redirigir al login
      this.router.navigate(['/login']);
      return;
    }
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotificationMenu = false; // Cerrar el otro menú
  }

  toggleNotificationMenu() {
    if (!this.isLoggedIn) {
      // Si no está loggeado, mostrar el menú con mensaje
      this.showNotificationMenu = !this.showNotificationMenu;
      this.showProfileMenu = false;
      return;
    }
    this.showNotificationMenu = !this.showNotificationMenu;
    this.showProfileMenu = false; // Cerrar el otro menú
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  goToProfile() {
    if (this.userInfo?.id) {
      this.router.navigate(['/author-profile', this.userInfo.id]);
      this.showProfileMenu = false;
    }
  }

  closeMenus() {
    this.showProfileMenu = false;
    this.showNotificationMenu = false;
  }
}
