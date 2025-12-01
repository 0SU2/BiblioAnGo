import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { UserService, LoanDTO } from '../../core/services/user';
import { AutorDTO, LibroDTO } from '../../core/services/books';

interface AuthorVM {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  city?: string;
  country?: string;
  stories: number;
  followers: number;
}

interface BookVM {
  isbn: string;
  title: string;
  image: string;
  category?: string;
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
    { id: 'authors', label: 'Autores' },
    { id: 'saved-books', label: 'Libros guardados' },
    { id: 'loans', label: 'Préstamos' }
  ];

  // Datos provenientes del backend
  allAuthors = signal<AuthorVM[]>([]);
  allSavedBooks = signal<BookVM[]>([]);
  allLoans = signal<LoanDTO[]>([]);

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  filteredAuthors = computed(() => {
    const query = this.normalizeText(this.searchQuery());
    const items = this.allAuthors();
    if (!query) return items;
    return items.filter(a => this.normalizeText(a.name).includes(query));
  });

  filteredBooks = computed(() => {
    const query = this.normalizeText(this.searchQuery());
    const items = this.allSavedBooks();
    if (!query) return items;
    return items.filter(b => this.normalizeText(b.title).includes(query));
  });

  filteredLoans = computed(() => {
    // En préstamos usualmente no se filtra por texto, pero se podría por título
    const query = this.normalizeText(this.searchQuery());
    const items = this.allLoans();
    if (!query) return items;
    return items.filter(l => this.normalizeText(l.titulo || '').includes(query));
  });

  constructor(public router: Router, private user: UserService) {}

  async ngOnInit() {
    await this.loadAll();
  }

  private async loadAll() {
    try {
      const [authors, savedBooks, loans] = await Promise.all([
        this.user.getMyAuthors(),
        this.user.getMyFavoriteBooks(),
        this.user.getMyLoans()
      ]);
      this.allAuthors.set(authors.map(this.mapAutor));
      this.allSavedBooks.set(savedBooks.map(this.mapLibro));
      this.allLoans.set(loans);
    } catch (e) {
      console.error('Error cargando favoritos', e);
    }
  }

  private mapAutor = (a: AutorDTO): AuthorVM => ({
    id: a.id_autor,
    name: [a.nombre, a.apaterno, a.amaterno || ''].filter(Boolean).join(' ').trim(),
    username: '@' + [a.nombre, a.apaterno, a.amaterno || ''].filter(Boolean).join('').toLowerCase(),
    avatar: undefined,
    city: a.ciudad,
    country: a.pais,
    // --- TEMPORARY FIX: Assign placeholder values ---
    stories: 0,
    followers: 0,
  });

  private mapLibro = (l: LibroDTO): BookVM => ({
    isbn: l.isbn,
    title: l.titulo,
    image: l.imagen,
    category: l.categoria
  });

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId as any);
  }

  onAuthorClick(authorId: string): void {
    this.router.navigate(['/author-profile', authorId]);
  }

  onBookClick(isbn: string): void {
    // Navegar a detalles del libro si existe la ruta
    console.log('Ver libro', isbn);
  }

  onSearch(): void {
    console.log('Buscando:', this.searchQuery());
  }
}
