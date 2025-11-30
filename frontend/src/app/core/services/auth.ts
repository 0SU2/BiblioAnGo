import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Api } from './api';

interface AuthReponse {
  status: boolean
  message: string
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Signal para saber si el usuario está autenticado
  isAuthenticated = signal<boolean>(false);
  authResponse: AuthReponse = { status: false, message: ""}

  // Signal para datos del usuario
  currentUser = signal<any>(null);

  constructor(private router: Router, private api: Api) {
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

  async login(usuario: string, password: string): Promise<AuthReponse> {
    let problemResponse: any;
    const { data, error } = await this.api.api.post('/user/auth/login', { usuario, password }).catch((problem:any):any => {
      problemResponse = problem.response.data;
      return problemResponse;
    }).then((value):any => {
      if(problemResponse) {
        return { error: problemResponse};
      }
      return value;
    })
    if (error) {
      this.authResponse.message = error;
      this.authResponse.status = false;
      return this.authResponse;
    }

    localStorage.setItem('currentUser', JSON.stringify(data.user));

    this.currentUser.set(data.user);
    this.isAuthenticated.set(true);
    this.authResponse.message = "";
    this.authResponse.status = true;

    return this.authResponse;
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
