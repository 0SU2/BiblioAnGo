import { Injectable } from '@angular/core';
import { LibroDTO, AutorDTO } from './books';

const BASE_URL = 'http://localhost:8080';

function buildHeaders(json: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface LoanDTO {
  isbn: string;               // libro
  titulo: string;             // libro
  imagen: string;             // libro
  fecha_de_creacion: string;  // fecha del préstamo
  fecha_de_entrega: string | null;
  estatus: 'activo' | 'finalizado' | string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  async getMyLoans(): Promise<LoanDTO[]> {
    const res = await fetch(`${BASE_URL}/api/user/data/loans`, {
      headers: buildHeaders(true)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }
}
