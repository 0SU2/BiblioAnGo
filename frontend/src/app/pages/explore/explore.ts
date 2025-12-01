import { Component, signal, computed, OnInit, resource, inject } from '@angular/core';
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
  year: number;
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
export class Explore implements OnInit {
  private readonly _bookService = inject(Books)
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
    { value: 'poesia', label: 'Poesia' },
    { value: 'ficcion', label: 'Ficción' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'fantasia', label: 'Fantasia' },
    { value: 'historia', label: 'Historia' },
    { value: 'ensayo', label: 'Ensayo' },
    { value: 'epica', label: 'Épica' },
    { value: 'drama', label: 'Drama' },
    { value: 'suspenso', label: 'Suspenso' }
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

  fetchAllBooksAPI = this._bookService.fetchAllBooksAPI
  fetchAllAutorsAPI = this._bookService.fetchAllAuthorsAPI
  fetchAllEditorialAPI = this._bookService.fetchAllEditorialAPI

  filteredBooks = computed(() => {
    let libros: LibroDTO[] = []
    let autores: AutorDTO[] = []
    let editoriales: EditorialDTO[] = []
    if(this.fetchAllBooksAPI.hasValue() && this.fetchAllAutorsAPI.hasValue() && this.fetchAllEditorialAPI.hasValue()) {
      libros = this.fetchAllBooksAPI.value()
      autores = this.fetchAllAutorsAPI.value()
      editoriales = this.fetchAllEditorialAPI.value()
      const authorMap = this.buildAuthorMap(autores);
      const editorialMap = this.buildEditorialMap(editoriales);
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

      // poblar los años
      let temp:Book[] = libros.map(l => this.mapLibroToBook(l, authorMap, editorialMap));
      this.years = temp.map(l => ({ value: l.year.toString(), label: l.year.toString()} as FilterOption))
      const query = this.normalizeText(this.searchQuery());

      // Búsqueda por texto
      if (query) {
        temp = temp.filter(book =>
          this.normalizeText(book.title).includes(query) ||
          this.normalizeText(book.author).includes(query)
        );
      }

      if (this.selectedCategory()) {
        temp = temp.filter(book => this.normalizeText(book.category) === this.normalizeText(this.selectedCategory()));
      }

      if (this.selectedDocType()) {
        temp = temp.filter(book => (book.docType || '') === this.selectedDocType());
      }

      if (this.selectedYear()) {
        temp = temp.filter(book => book.year?.toString() === this.selectedYear());
      }

      if (this.selectedLanguage()) {
        temp = temp.filter(book => (book.language || '') === this.selectedLanguage());
      }

      if (this.selectedAuthor()) {
        temp = temp.filter(book => this.normalizeText(book.author) === this.normalizeText(this.selectedAuthor()));
      }

      if (this.selectedPublisher()) {
        temp = temp.filter(book => this.normalizeText(book.publisher || '') === this.normalizeText(this.selectedPublisher()));
      }

      if (this.selectedSubject()) {
        temp = temp.filter(book => this.normalizeText(book.category) === this.normalizeText(this.selectedSubject()));
      }

      if(this.selectedTag()) {
        temp = temp.filter(book => this.normalizeText(book.tag || '') === this.normalizeText(this.selectedTag()));
      }
      return temp
    }
    return undefined
  });

  constructor(
    private router: Router,
    public auth: Auth,
    private booksService: Books
  ) { }

  ngOnInit():void { }

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
      rating: l.calificacion,
      category: l.categoria || '',
      docType: l.tipo_de_documento,
      publisher: editorialMap.get(l.editoria_id) || undefined,
      year: new Date(l.fecha_de_publicacion).getFullYear(),
      language: l.lenguaje,
      tag: l.tag,
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
