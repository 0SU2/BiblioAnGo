import { Injectable } from '@angular/core';

const BASE_URL = 'http://localhost:8080';

function buildHeaders(json: boolean = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('auth_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export interface StoryDTO {
  id: number;
  titulo: string;
  capitulos: number;
  cover: string | null;
  ultima_actualizacion: string;
  vistas: number;
  likes: number;
  comentarios: number;
  estatus: 'draft' | 'published' | string;
}

export interface ChapterDTO {
  id: number;
  story_id: number;
  titulo: string;
  contenido: string;
  nro: number;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class StoriesService {
  // Historias
  async getMyStories(): Promise<StoryDTO[]> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories`, {
      headers: buildHeaders(true)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }

  async createStory(payload: { titulo: string; cover?: string | null; estatus?: 'draft' | 'published' }): Promise<StoryDTO> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data;
  }

  async updateStory(id: number, payload: Partial<{ titulo: string; cover: string | null; estatus: 'draft' | 'published' }>): Promise<StoryDTO> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories/${id}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data;
  }

  async deleteStory(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories/${id}`, {
      method: 'DELETE',
      headers: buildHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
  }

  // Capítulos
  async getChapters(storyId: number): Promise<ChapterDTO[]> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories/${storyId}/chapters`, {
      headers: buildHeaders(true)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data ?? [];
  }

  async createChapter(storyId: number, payload: { titulo: string; contenido: string }): Promise<ChapterDTO> {
    const res = await fetch(`${BASE_URL}/api/user/data/stories/${storyId}/chapters`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data;
  }

  async updateChapter(chapterId: number, payload: Partial<{ titulo: string; contenido: string }>): Promise<ChapterDTO> {
    const res = await fetch(`${BASE_URL}/api/user/data/chapters/${chapterId}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data?.data;
  }

  async deleteChapter(chapterId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/user/data/chapters/${chapterId}`, {
      method: 'DELETE',
      headers: buildHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
  }
}
