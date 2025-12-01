import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { Books, LibroDTO, AutorDTO, EditorialDTO } from '../../core/services/books';

interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  category: string;
  docType?: string;
  publisher?: string;
  year?: number;
  language?: string;
  tag?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './explore.html',
})
export class Explore {
  searchQuery = signal('');
  showFilters = signal(false);
  favoriteBooks = signal<Set<string>>(new Set());

  viewMode = signal<'grid' | 'list'>('grid');

  selectedDocType = signal('');
  selectedAuthor = signal('');
  selectedCategory = signal('');
  selectedSubject = signal('');
  selectedTag = signal('');
  selectedPublisher = signal('');
  selectedYear = signal('');
  selectedLanguage = signal('');

  showLoginModal = signal(false);
  modalMessage = signal('');

  docTypes: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: 'libro', label: 'Libro' },
    { value: 'revista', label: 'Revista' },
    { value: 'articulo', label: 'Artículo' }
  ];

  // Se llenará dinámicamente desde backend
  authors: FilterOption[] = [
    { value: '', label: 'Todos' }
  ];

  // Se llenará dinámicamente en base a los libros obtenidos
  categories: FilterOption[] = [
    { value: '', label: 'Todas' }
  ];

  subjects: FilterOption[] = [
    { value: '', label: 'Todas' },
    { value: 'ficcion', label: 'Ficción' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'historia', label: 'Historia' },
    { value: 'arte', label: 'Arte' }
  ];

  tags: FilterOption[] = [
    { value: '', label: 'Todas' },
    { value: 'popular', label: 'Popular' },
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'recomendado', label: 'Recomendado' }
  ];

  // Se llenará dinámicamente desde backend
  publishers: FilterOption[] = [
    { value: '', label: 'Todas' }
  ];

  years: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];

  languages: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' },
    { value: 'fr', label: 'Francés' }
  ];

  allBooks: Book[] = [];

  // Función para normalizar acentos
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  filteredBooks = computed(() => {
    let books = this.allBooks;
    const query = this.normalizeText(this.searchQuery());

    // Búsqueda por texto
    if (query) {
      books = books.filter(book =>
        this.normalizeText(book.title).includes(query) ||
        this.normalizeText(book.author).includes(query)
      );
    }

    if (this.selectedCategory()) {
      books = books.filter(book => this.normalizeText(book.category) === this.normalizeText(this.selectedCategory()));
    }

    if (this.selectedDocType()) {
      books = books.filter(book => (book.docType || '') === this.selectedDocType());
    }

    if (this.selectedYear()) {
      books = books.filter(book => book.year?.toString() === this.selectedYear());
    }

    if (this.selectedLanguage()) {
      books = books.filter(book => (book.language || '') === this.selectedLanguage());
    }

    if (this.selectedAuthor()) {
      books = books.filter(book => this.normalizeText(book.author) === this.normalizeText(this.selectedAuthor()));
    }

    if (this.selectedPublisher()) {
      books = books.filter(book => this.normalizeText(book.publisher || '') === this.normalizeText(this.selectedPublisher()));
    }

    return books;
  });

  constructor(
    private router: Router,
    public auth: Auth,
    private booksService: Books
  ) {}

  async ngOnInit() {
    try {
      const [libros, autores, editoriales] = await Promise.all([
        this.booksService.getBooks(),
        this.booksService.getAuthors(),
        this.booksService.getEditorials(),
      ]);

      const authorMap = this.buildAuthorMap(autores);
      const editorialMap = this.buildEditorialMap(editoriales);

      this.allBooks = libros.map(l => this.mapLibroToBook(l, authorMap, editorialMap));

      // Poblar categorías dinámicamente con las categorías presentes en los libros
      const catSet = new Set<string>();
      for (const l of libros) {
        if (l.categoria) catSet.add(l.categoria);
      }
      this.categories = [
        { value: '', label: 'Todas' },
        ...Array.from(catSet).map(c => ({ value: this.normalizeText(c), label: c }))
      ];

      // Poblar autores y editoriales desde backend
      const authorOptions = autores.map(a => this.authorName(a)).filter(Boolean);
      this.authors = [
        { value: '', label: 'Todos' },
        ...authorOptions.map(name => ({ value: name, label: name }))
      ];

      const editorialOptions = editoriales.map(e => e.Nombre).filter(Boolean);
      this.publishers = [
        { value: '', label: 'Todas' },
        ...editorialOptions.map(name => ({ value: name, label: name }))
      ];
    } catch (e) {
      console.error('Error cargando datos de explorar', e);
    }
  }

  private buildAuthorMap(autores: AutorDTO[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const a of autores) {
      const name = this.authorName(a);
      map.set(a.id_autor, name);
    }
    return map;
  }

  private buildEditorialMap(editoriales: EditorialDTO[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const e of editoriales) {
      map.set(e.id_editoria, e.Nombre);
    }
    return map;
  }

  private authorName(a: AutorDTO): string {
    const parts = [a.nombre, a.apaterno, a.amaterno || ''].filter(Boolean);
    return parts.join(' ').trim();
  }

  private mapLibroToBook(l: LibroDTO, authorMap: Map<string, string>, editorialMap: Map<string, string>): Book {
    return {
      id: l.isbn,
      title: l.titulo,
      author: authorMap.get(l.autor_id) || '',
      image: l.imagen,
      rating: 0,
      category: l.categoria || '',
      docType: undefined,
      publisher: editorialMap.get(l.editoria_id) || undefined,
      year: l.fecha_de_publicacion ? new Date(l.fecha_de_publicacion).getFullYear() : undefined,
      language: undefined,
      tag: undefined,
    };
  }

  onSearch(): void {
    // No-op, el computed filtra automáticamente
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  onAdvancedSearch(): void {
    this.showFilters.update(currentValue => !currentValue);
  }

  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }

  clearFilters(): void {
    this.selectedDocType.set('');
    this.selectedAuthor.set('');
    this.selectedCategory.set('');
    this.selectedSubject.set('');
    this.selectedTag.set('');
    this.selectedPublisher.set('');
    this.selectedYear.set('');
    this.selectedLanguage.set('');
  }

  onBookClick(bookId: string): void {
    console.log('Ver detalles del libro:', bookId);
    alert(`Ver detalles del libro #${bookId}`);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  onAddToFavorites(bookId: string, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('agregar este libro a favoritos');
      return;
    }

    const favorites = new Set(this.favoriteBooks());

    if (favorites.has(bookId)) {
      favorites.delete(bookId);
    } else {
      favorites.add(bookId);
    }

    this.favoriteBooks.set(favorites);
  }

  isFavorite(bookId: string): boolean {
    return this.favoriteBooks().has(bookId);
  }

  onRequestLoan(bookId: string, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('leer este libro');
      return;
    }

    console.log('Solicitar préstamo:', bookId);
    alert(`Préstamo del libro #${bookId} solicitado`);
  }

  private showLoginRequired(action: string): void {
    this.modalMessage.set(`Necesitas iniciar sesión para ${action}`);
    this.showLoginModal.set(true);
  }

  closeModal(): void {
    this.showLoginModal.set(false);
  }

  goToLogin(): void {
    this.closeModal();
    this.router.navigate(['/login']);
  }
}
