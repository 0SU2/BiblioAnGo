import { inject, Injectable } from '@angular/core';
import { LibroDTO, AutorDTO } from './books';
import { Api } from './api';

const BASE_URL = 'http://localhost:8080';

function buildHeaders(json: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface LoanDTO {
  id: string;
  titulo: string;
  isbn: string;
  imagen: string;
  fecha_creacion: string;
  fecha_entrega?: string;
  estatus: 'pendiente' | 'activo' | 'finalizado';
  usuario_nombre?: string;
  usuario_apaterno?: string;
  usuario_correo?: string;
  usuario_avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _api = inject(Api)

  async getMyFavoriteBooks(): Promise<LibroDTO[]> {
    const res = await fetch(`${BASE_URL}/api/user/data/favorites`, {
      headers: buildHeaders(true)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }

  async addFavorite(isbn: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/data/favorites/${encodeURIComponent(isbn)}`, {
      method: 'POST',
      headers: buildHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
  }

  async removeFavorite(isbn: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/data/favorites/${encodeURIComponent(isbn)}`, {
      method: 'DELETE',
      headers: buildHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
  }

  async getMyAuthors(): Promise<AutorDTO[]> {
    const res = await fetch(`${BASE_URL}/api/user/data/authors`, {
      headers: buildHeaders(true)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }

  async getMyLoans(): Promise<void> {
    await this._api.api.post('/user/data/allLoans').catch((err) => {
      console.log(err)
    })
  }
}
