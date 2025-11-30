import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

interface Author {
  id: number;
  name: string;
  username: string;
  avatar: string;
  stories: number;
  followers: number;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './favorites.html',
})
export class Favorites {
  searchQuery = signal('');
  selectedCategory = signal<'authors' | 'saved-books' | 'loans'>('authors');

  categories = [
    { id: 'autores', label: 'Autores' },
    { id: 'saved-books', label: 'Libros guardados' },
    { id: 'loans', label: 'Prestamos' }
  ];

  // Mantengo todos los autores para simular la búsqueda y lista
  allAuthors: Author[] = [
    {
      id: 1,
      name: 'eVEm',
      username: '@eVEm',
      avatar: '/assets/authors/evem.jpg',
      stories: 12,
      followers: 454
    },
    {
      id: 2,
      name: 'vepiex4',
      username: '@vepiex4',
      avatar: '/assets/authors/vepiex4.jpg',
      stories: 2,
      followers: 30
    },
    {
      id: 3,
      name: 'M.J.',
      username: '@Mj',
      avatar: '/assets/authors/mj.jpg',
      stories: 26,
      followers: 640
    },
    {
      id: 4,
      name: 'Luna Morales',
      username: '@LunaMorales',
      avatar: '/assets/authors/luna.jpg',
      stories: 8,
      followers: 189
    },
    {
      id: 5,
      name: 'Carlos Vega',
      username: '@CVega',
      avatar: '/assets/authors/carlos.jpg',
      stories: 15,
      followers: 892
    },
    {
      id: 6,
      name: 'Ana Rivera',
      username: '@AnaR',
      avatar: '/assets/authors/ana.jpg',
      stories: 34,
      followers: 1205
    }
  ];

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  filteredAuthors = computed(() => {
    const query = this.normalizeText(this.searchQuery());

    if (!query) {
      return this.allAuthors;
    }

    return this.allAuthors.filter(author =>
      this.normalizeText(author.name).includes(query) ||
      this.normalizeText(author.username).includes(query)
    );
  });

  constructor(public router: Router) {}

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId as any);
  }

  // >>> CAMBIO CLAVE: Usar router.navigate para ir a la ruta /author-profile/:id
  onAuthorClick(authorId: number): void {
    console.log('Navegando al perfil del autor:', authorId);
    this.router.navigate(['/author-profile', authorId]);
  }

  onSearch(): void {
    console.log('Buscando:', this.searchQuery());
  }
}
