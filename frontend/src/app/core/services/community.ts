import { Injectable } from '@angular/core';

const BASE_URL = 'http://localhost:8080';

export interface AutorDTO {
  id_autor: string;
  nombre: string;
  apaterno: string;
  amaterno: string | null;
  ciudad: string;
  pais: string;
  fecha_de_nacimiento: string;
}

export interface EditorialDTO {
  id_editoria: string;
  Nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  fecha_de_fundacion: string;
}

@Injectable({ providedIn: 'root' })
export class CommunityService {
  async getAuthors(): Promise<AutorDTO[]> {
    const res = await fetch(`${BASE_URL}/api/allAutors`);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }
  async getEditorials(): Promise<EditorialDTO[]> {
    const res = await fetch(`${BASE_URL}/api/allEditorial`);
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }
}
