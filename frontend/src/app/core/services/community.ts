import { Injectable, resource } from '@angular/core';

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

export interface ClubesIntefaz {
	id_club: string
	titulo: string
	descripcion: string
	imagen: string
	miembros: number
  tipo: string
	categoria: string
	calificacion: number
	tag: string
}

@Injectable({ providedIn: 'root' })
export class CommunityService {

  readonly fetchAllClubs = resource({
    loader : async() => {
      try {
        const res = await (await fetch(`${BASE_URL}/api/allClubs`)).json() as { data: ClubesIntefaz[] };
        return res.data;
      } catch (error) {
        throw error
      }
    }
  });
}
