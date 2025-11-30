import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

const BASE_URL = 'http://localhost:8080';

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
    const storedToken = localStorage.getItem('auth_token');
    if (storedUser && storedToken) {
      this.currentUser.set(JSON.parse(storedUser));
      this.isAuthenticated.set(true);
    }
  }

  async login(usuario: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/api/user/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Usuario: usuario, Password: password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (!data?.token || !data?.user) return false;

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      this.currentUser.set(data.user);
      this.isAuthenticated.set(true);
      return true;
    } catch (e) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  async register(payload: {
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    ciudad: string;
    pais: string;
    usuario: string;
    password: string;
  }): Promise<boolean> {
    // Validaciones mínimas requeridas por la BD: nombre, apaterno, usuario, contraseña
    if (!payload.nombre?.trim() || !payload.apPaterno?.trim() || !payload.usuario?.trim() || !payload.password?.trim()) {
      throw new Error('Campos obligatorios: nombre, apellido paterno, usuario y contraseña');
    }
    try {
      const res = await fetch(`${BASE_URL}/api/user/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: payload.nombre,
          apaterno: payload.apPaterno,
          amaterno: payload.apMaterno,
          correo: '',
          direccion: '',
          ciudad: payload.ciudad,
          estado: '',
          pais: payload.pais,
          telefono: '',
          usuario: payload.usuario,
          avatar: '',
          biografia: '',
          contraseña: payload.password,
          facebook_link: '',
          instagram_link: '',
          twitter_link: ''
        })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Error en registro');
      }
      const data = await res.json();
      const user = data?.data ?? data?.user ?? null;
      const token = data?.token ?? null;
      if (!user || !token) {
        throw new Error('Respuesta inválida del servidor');
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      return true;
    } catch (e) {
      throw e;
    }
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
