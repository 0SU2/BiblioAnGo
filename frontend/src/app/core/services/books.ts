import { Injectable, resource } from '@angular/core';

const BASE_URL = 'http://localhost:8080';

export interface LibroDTO {
  isbn: string;
  titulo: string;
  fecha_de_publicacion: string;
  cantidad: number;
  no_edicion: string;
  no_paginas: string;
  prologo: string;
  imagen: string;
  categoria: string;
  calificacion: number;
  tag: string;
  tipo_de_documento: string;
  lenguaje: string;
  autor_id: string;
  editoria_id: string;
}

export interface LibroANDAutor {
  isbn: string;
  titulo: string;
  fecha_de_publicacion: string;
  cantidad: number;
  no_edicion: string;
  no_paginas: string;
  prologo: string;
  imagen: string;
  categoria: string;
  calificacion: number;
  tag: string;
  tipo_de_documento: string;
  lenguaje: string;
  autor_id: string;
  editoria_id: string;
	nombre_autor: string;
	apaterno_autor: string;
	amaterno_autor: string;
}

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

@Injectable({
  providedIn: 'root',
})
export class Books {

  readonly fetchAllBooksAPI = resource({
    loader : async() => {
      try {
        const res = await (await fetch(`${BASE_URL}/api/allBooks`)).json() as { data: LibroDTO[] };
        return res.data;
      } catch (error) {
        throw error
      }
    }
  });
  readonly fetchAllAuthorsAPI = resource({
    loader : async() => {
      try {
        const res = await (await fetch(`${BASE_URL}/api/allAutors`)).json() as { data: AutorDTO[] };
        return res.data;
      } catch (error) {
        throw error
      }
    }
  });
  readonly fetchAllEditorialAPI = resource({
    loader : async() => {
      try {
        const res = await (await fetch(`${BASE_URL}/api/allEditorial`)).json() as { data: EditorialDTO[] };
        return res.data;
      } catch (error) {
        throw error
      }
    }
  });
  readonly filteredBooks = resource({
    loader : async() => {
      try {
        const res = await (await fetch(`${BASE_URL}/api/allBooksWithAutor`)).json() as { data: LibroANDAutor[] };
        return res.data;
      } catch (error) {
        throw error
      }
    }
  });
}
