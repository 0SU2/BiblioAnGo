import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Signal para saber si el usuario está autenticado
  isAuthenticated = signal<boolean>(false);

  // Signal para datos del usuario
  currentUser = signal<any>(null);

  constructor(private router: Router) {
    // Verificar si hay sesión guardada al iniciar
    this.checkStoredSession();
  }

  private checkStoredSession(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
      this.isAuthenticated.set(true);
    }
  }

  login(usuario: string, password: string): boolean {

    const userData = {
      id: 1,
      usuario: usuario,
      email: `${usuario}@example.com`,
      nombre: usuario
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));

    this.currentUser.set(userData);
    this.isAuthenticated.set(true);

    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  register(usuario: string, email: string, password: string): boolean {

    const userData = {
      id: Date.now(),
      usuario: usuario,
      email: email,
      nombre: usuario
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));

    this.currentUser.set(userData);
    this.isAuthenticated.set(true);

    return true;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  redirectToLogin(returnUrl?: string): void {
    if (returnUrl) {
      localStorage.setItem('returnUrl', returnUrl);
    }
    this.router.navigate(['/login']);
  }

  getAndClearReturnUrl(): string | null {
    const returnUrl = localStorage.getItem('returnUrl');
    if (returnUrl) {
      localStorage.removeItem('returnUrl');
      return returnUrl;
    }
    return null;
  }
}
