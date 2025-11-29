import { Component, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

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
  followedStories: number;
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
export class AuthorProfileData {
  selectedTab = signal<'stories' | 'reading-list' | 'announcements'>('stories');
  isFollowing = signal(false);
  showMoreMenu = signal(false);

  authorId: string | null = null;

  // Información del autor (Inicializado como un objeto vacío para ser llenado después)
  author: AuthorProfile = {} as AuthorProfile;
  // Historias del autor (Se llenarán según el autor)
  stories: Story[] = [];

  // Datos fijos para simular la base de datos (DB)
  private readonly allAuthorsData: AuthorProfile[] = [
    {
      id: 1,
      name: 'eVEm',
      username: '@eVEm',
      avatar: '/assets/authors/evem.jpg',
      bio: 'Explorando los límites del omniverso y el destino de diferentes protagonistas. Sus historias desafían la lógica, sumergiendo a los lectores en un viaje donde el conocimiento es poder... y condena.',
      followers: '2.2k',
      following: 252,
      followedStories: 52,
      memberSince: 'Oct 21, 2024',
      socialLinks: {
        facebook: 'https://facebook.com/evem',
        instagram: 'https://instagram.com/evem',
        twitter: 'https://twitter.com/evem'
      }
    },
    {
      id: 2,
      name: 'vepiex4',
      username: '@vepiex4',
      avatar: '/assets/authors/vepiex4.jpg',
      bio: 'Aventuras intergalácticas y viajes en el tiempo. Buscando el significado de la existencia en los confines del cosmos.',
      followers: '5.8k',
      following: 105,
      followedStories: 12,
      memberSince: 'Nov 10, 2023',
      socialLinks: {
        instagram: 'https://instagram.com/vepiex4'
      }
    }
  ];

  // Datos fijos de las historias (simulando una DB)
  private readonly allStoriesData: Story[] = [
    {
      id: 1,
      title: 'Argonauta',
      description: 'Eres el último. Tu mundo ha sido aniquilado, borrado de la existencia como si nunca hubiera sido. Pero aún respiras. En medio del vacío infinito, una ciudad imposible se alza ante ti. NIDO, el refugio de los perdidos, el hogar de aquellos que han sobrevivido al fin de su realidad.',
      coverImage: '/assets/stories/argonauta.jpg',
      views: '2.2k',
      chapters: 102,
      status: 'En Progreso',
      tags: ['#351', 'fantasía', 'eVEm'], // Añadido Tag de autor para la simulación
    },
    {
      id: 2,
      title: 'The Realm of Gods',
      description: 'Un reino más allá de la comprensión. Un espacio que esconde secretos ancestrales. Cuando el caos amenaza con consumirlo todo, solo aquellos dispuestos a desafiar a los dioses podrán cambiar el destino.',
      coverImage: '/assets/stories/realm-gods.jpg',
      views: '1.2k',
      chapters: 53,
      status: 'En Progreso',
      tags: ['#351', 'aventura', 'eVEm'], // Añadido Tag de autor para la simulación
    },
    {
      id: 3,
      title: 'Tittle book',
      description: 'Cuando la primera nevada cae, las sombras despiertan. Un antiguo hechizo se entrelaza con el tiempo, atrapando almas en una red de secretos oscuros. Solo aquellos dispuestos a desafiar la magia prohibida podrán romper las cadenas del pasado.',
      coverImage: '/assets/stories/tittle-book.jpg',
      views: '856',
      chapters: 28,
      status: 'En Progreso',
      tags: ['#351', 'misterio', 'eVEm'], // Añadido Tag de autor para la simulación
    },
    {
      id: 4,
      title: 'Viaje a Nebulosa',
      description: 'Tras el colapso del hiperespacio, un equipo de colonos debe encontrar un nuevo hogar antes de que su nave de soporte falle. La Nebulosa de Orión es su única esperanza.',
      coverImage: '/assets/stories/nebulosa.jpg',
      views: '998',
      chapters: 4,
      status: 'Completado',
      tags: ['ciencia ficción', 'vepiex4'], // Añadido Tag de autor para la simulación
    }
  ];

  // >>> CAMBIO CLAVE: Lógica de carga de datos basada en el ID
  private loadAuthorData(id: number): void {
    const foundAuthor = this.allAuthorsData.find(a => a.id === id);

    if (foundAuthor) {
      this.author = foundAuthor;
      // Simular la carga de historias filtrando por el nombre de usuario/autor
      this.stories = this.allStoriesData.filter(story =>
        story.tags.includes(this.author.username.replace('@', ''))
        || story.tags.includes(this.author.name.split(' ')[0]) // Filtro por nombre o username
      );

      console.log(`Perfil cargado para: ${this.author.name}`);
    } else {
      console.error(`Autor con ID ${id} no encontrado.`);
      // Opcional: Redirigir a una página 404
    }
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authorId = this.route.snapshot.paramMap.get('id');

    // Llamar a la función de carga al iniciar el componente
    if (this.authorId) {
      this.loadAuthorData(parseInt(this.authorId, 10));
    }
  }

  selectTab(tab: 'stories' | 'reading-list' | 'announcements'): void {
    this.selectedTab.set(tab);
  }

  toggleFollow(): void {
    this.isFollowing.update(v => !v);
    const message = this.isFollowing() ?
      `Ahora sigues a ${this.author.name}` :
      `Has dejado de seguir a ${this.author.name}`;
    console.log(message);
  }

  toggleMoreMenu(): void {
    this.showMoreMenu.update(v => !v);
  }

  onStoryClick(storyId: number): void {
    console.log('Ver historia:', storyId);
    this.router.navigate(['/story', storyId]);
  }

  onShareProfile(): void {
    console.log('Compartir perfil');
    alert('Enlace del perfil copiado al portapapeles');
    this.showMoreMenu.set(false);
  }

  onReportProfile(): void {
    console.log('Reportar perfil');
    alert('Reportar perfil');
    this.showMoreMenu.set(false);
  }

  onBlockUser(): void {
    if (confirm(`¿Estás seguro de que deseas bloquear a ${this.author.name}?`)) {
      console.log('Bloquear usuario');
      alert('Usuario bloqueado');
      this.showMoreMenu.set(false);
    }
  }

  openSocialLink(platform: string): void {
    const link = this.author.socialLinks[platform as keyof typeof this.author.socialLinks];
    if (link) {
      window.open(link, '_blank');
    }
  }
}
