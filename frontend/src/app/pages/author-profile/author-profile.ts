import { Component, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { StoriesService, StoryDTO } from '../../core/services/stories';
import { Api } from '../../core/services/api';

interface Story {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  views: string;
  chapters: number;
  status: string;
  tags: string[];
}

interface AuthorProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: string;
  following: number;
  memberSince: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

@Component({
  selector: 'app-author-profile',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './author-profile.html',
})
export class AuthorProfileData implements OnInit {
  selectedTab = signal<'stories' | 'reading-list' | 'announcements'>('stories');
  isFollowing = signal(false);
  showMoreMenu = signal(false);
  isOwnProfile = signal(false);
  isLoading = signal(true);

  authorId: string | null = null;

  // Información del autor
  author: AuthorProfile = {
    id: 0,
    name: '',
    username: '',
    avatar: '',
    bio: '',
    followers: '0',
    following: 0,
    memberSince: '',
    socialLinks: {}
  };

  stories: Story[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: Auth,
    private storiesService: StoriesService,
    private api: Api
  ) {}

  async ngOnInit(): Promise<void> {
    this.authorId = this.route.snapshot.paramMap.get('id');

    if (this.authorId) {
      const currentUser = this.authService.currentUser();

      // Verificar si es el perfil del usuario actual
      if (currentUser && currentUser.nua === this.authorId) {
        this.isOwnProfile.set(true);
        await this.loadCurrentUserProfile(currentUser);
      } else {
        // Cargar perfil de otro autor desde el backend
        await this.loadAuthorDataFromBackend(this.authorId);
      }
    }

    this.isLoading.set(false);
  }

  private async loadCurrentUserProfile(user: any): Promise<void> {
    try {
      // Mapear los datos del usuario autenticado al formato de perfil
      this.author = {
        id: parseInt(user.nua) || 0,
        name: user.nombre || 'Usuario',
        username: user.usuario ? `@${user.usuario}` : '@usuario',
        avatar: user.avatar || '/assets/default-avatar.png',
        bio: user.biografia || 'Sin biografía',
        followers: '0', // TODO: Implementar contador de seguidores en backend
        following: 0,   // TODO: Implementar contador de siguiendo en backend
        memberSince: user.fecha_de_creacion ?
          new Date(user.fecha_de_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'Fecha desconocida',
        socialLinks: {
          facebook: user.facebook_link || undefined,
          instagram: user.instagram_link || undefined,
          twitter: user.twitter_link || undefined
        }
      };

      // Cargar las historias del usuario desde el backend
      await this.loadUserStories();

      console.log(`Perfil propio cargado: ${this.author.name}`);
    } catch (error) {
      console.error('Error al cargar perfil propio:', error);
      alert('Error al cargar el perfil');
    }
  }

  private async loadAuthorDataFromBackend(authorId: string): Promise<void> {
    try {
      // Obtener datos del autor desde el backend
      const response = await this.api.api.get(`/user/profile/${authorId}`);
      const userData = response.data;

      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      // Mapear los datos al formato de perfil
      this.author = {
        id: parseInt(userData.nua) || 0,
        name: userData.nombre || 'Usuario',
        username: userData.usuario ? `@${userData.usuario}` : '@usuario',
        avatar: userData.avatar || '/assets/default-avatar.png',
        bio: userData.biografia || 'Sin biografía',
        followers: '0', // TODO: Implementar contador de seguidores
        following: 0,   // TODO: Implementar contador de siguiendo
        memberSince: userData.fecha_de_creacion ?
          new Date(userData.fecha_de_creacion).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'Fecha desconocida',
        socialLinks: {
          facebook: userData.facebook_link || undefined,
          instagram: userData.instagram_link || undefined,
          twitter: userData.twitter_link || undefined
        }
      };

      // Cargar historias del autor
      await this.loadAuthorStories(authorId);

      console.log(`Perfil cargado para: ${this.author.name}`);
    } catch (error: any) {
      console.error('Error al cargar datos del autor:', error);
      if (error?.response?.status === 404) {
        alert('Autor no encontrado');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Error al cargar el perfil del autor');
      }
    }
  }

  private async loadUserStories(): Promise<void> {
    try {
      const storiesData: StoryDTO[] = await this.storiesService.getMyStories();

      this.stories = storiesData.map(story => ({
        id: story.id,
        title: story.titulo,
        description: 'Historia sin descripción', // TODO: Agregar campo descripción en backend
        coverImage: story.cover || '/assets/default-cover.jpg',
        views: story.vistas.toString(),
        chapters: story.capitulos,
        status: story.estatus === 'published' ? 'Publicado' : 'Borrador',
        tags: [] // TODO: Agregar sistema de tags en backend
      }));

      console.log(`Cargadas ${this.stories.length} historias del usuario`);
    } catch (error) {
      console.error('Error al cargar historias del usuario:', error);
      this.stories = [];
    }
  }

  private async loadAuthorStories(authorId: string): Promise<void> {
    try {
      // Obtener historias del autor desde el backend
      const response = await this.api.api.get(`/user/profile/${authorId}/stories`);
      const storiesData = response.data;

      if (!storiesData || !Array.isArray(storiesData)) {
        this.stories = [];
        return;
      }

      this.stories = storiesData.map((story: any) => ({
        id: story.id,
        title: story.titulo,
        description: story.descripcion || 'Sin descripción',
        coverImage: story.cover || '/assets/default-cover.jpg',
        views: story.vistas?.toString() || '0',
        chapters: story.capitulos || 0,
        status: story.estatus === 'published' ? 'Publicado' : 'Borrador',
        tags: story.tags || []
      }));

      console.log(`Cargadas ${this.stories.length} historias del autor`);
    } catch (error) {
      console.error('Error al cargar historias del autor:', error);
      this.stories = [];
    }
  }

  selectTab(tab: 'stories' | 'reading-list' | 'announcements'): void {
    this.selectedTab.set(tab);
  }

  toggleFollow(): void {
    if (this.isOwnProfile()) {
      console.log('No puedes seguirte a ti mismo');
      return;
    }

    this.isFollowing.update(v => !v);
    const message = this.isFollowing() ?
      `Ahora sigues a ${this.author.name}` :
      `Has dejado de seguir a ${this.author.name}`;
    console.log(message);

    // TODO: Implementar llamada al backend para seguir/dejar de seguir
  }

  toggleMoreMenu(): void {
    this.showMoreMenu.update(v => !v);
  }

  onStoryClick(storyId: number): void {
    console.log('Ver historia:', storyId);
    this.router.navigate(['/story', storyId]);
  }

  onShareProfile(): void {
    const profileUrl = `${window.location.origin}/author-profile/${this.authorId}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert('Enlace del perfil copiado al portapapeles');
    }).catch(() => {
      alert('No se pudo copiar el enlace');
    });
    this.showMoreMenu.set(false);
  }

  onReportProfile(): void {
    console.log('Reportar perfil');
    alert('Función de reportar perfil - Por implementar en backend');
    this.showMoreMenu.set(false);
  }

  onBlockUser(): void {
    if (confirm(`¿Estás seguro de que deseas bloquear a ${this.author.name}?`)) {
      console.log('Bloquear usuario');
      alert('Función de bloquear usuario - Por implementar en backend');
      this.showMoreMenu.set(false);
      // TODO: Implementar llamada al backend para bloquear usuario
    }
  }

  openSocialLink(platform: string): void {
    const link = this.author.socialLinks[platform as keyof typeof this.author.socialLinks];
    if (link) {
      window.open(link, '_blank');
    }
  }
}
