import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

interface Book {
  id: number;
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
  viewMode = signal<'grid' | 'list'>('grid');
  showFilters = signal(false); // La sección de filtros avanzados se ocultará por defecto

  // Filtros
  selectedDocType = signal('');
  selectedAuthor = signal('');
  selectedCategory = signal('');
  selectedSubject = signal('');
  selectedTag = signal('');
  selectedPublisher = signal('');
  selectedYear = signal('');
  selectedLanguage = signal('');

  // Opciones para los filtros
  docTypes: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: 'libro', label: 'Libro' },
    { value: 'revista', label: 'Revista' },
    { value: 'articulo', label: 'Artículo' }
  ];

  authors: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: 'tolkien', label: 'J.R.R. Tolkien' },
    { value: 'rowling', label: 'J.K. Rowling' },
    { value: 'asimov', label: 'Isaac Asimov' }
  ];

  categories: FilterOption[] = [
    { value: '', label: 'Todas' },
    { value: 'infantil', label: 'Infantil' },
    { value: 'juvenil', label: 'Juvenil' },
    { value: 'adulto', label: 'Adulto' },
    { value: 'academico', label: 'Académico' }
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

  publishers: FilterOption[] = [
    { value: '', label: 'Todas' },
    { value: 'norma', label: 'Editorial Norma' },
    { value: 'planeta', label: 'Editorial Planeta' },
    { value: 'santillana', label: 'Santillana' }
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

  // Catálogo de libros
  allBooks: Book[] = [
    {
      id: 1,
      title: 'Jurisdicción y Arbitraje',
      author: 'Marianella Ledesma Narváez',
      image: '/assets/books/jurisdiccion.jpg',
      rating: 5,
      category: 'academico',
      docType: 'libro',
      publisher: 'Editorial Universidad',
      year: 2023,
      language: 'es'
    },
    {
      id: 2,
      title: 'Isra & El Dragón',
      author: 'K.A. Gelan',
      image: '/assets/books/isra-dragon.jpg',
      rating: 4,
      category: 'juvenil',
      docType: 'libro',
      year: 2024,
      language: 'es',
      tag: 'Nuevo'
    },
    {
      id: 3,
      title: 'Quintessence',
      author: 'Jess Redman',
      image: '/assets/books/quintessence.jpg',
      rating: 5,
      category: 'juvenil',
      docType: 'libro',
      year: 2023,
      language: 'es',
      tag: 'Popular'
    },
    {
      id: 4,
      title: 'Hablemos de Cine (Antología)',
      author: 'Varios Autores',
      image: '/assets/books/cine.jpg',
      rating: 4,
      category: 'adulto',
      docType: 'libro',
      year: 2022,
      language: 'es'
    },
    {
      id: 5,
      title: 'Floating World',
      author: 'Author Name',
      image: '/assets/books/floating-world.jpg',
      rating: 5,
      category: 'adulto',
      docType: 'libro',
      year: 2024,
      language: 'en'
    },
    {
      id: 6,
      title: 'Wingfeather Saga',
      author: 'Andrew Peterson',
      image: '/assets/books/wingfeather.jpg',
      rating: 5,
      category: 'juvenil',
      docType: 'libro',
      year: 2023,
      language: 'es'
    }
  ];

  // Libros filtrados
  filteredBooks = computed(() => {
    let books = this.allBooks;
    const query = this.searchQuery().toLowerCase().trim();

    // Filtrar por búsqueda
    if (query) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros
    if (this.selectedCategory()) {
      books = books.filter(book => book.category === this.selectedCategory());
    }

    if (this.selectedDocType()) {
      books = books.filter(book => book.docType === this.selectedDocType());
    }

    if (this.selectedYear()) {
      books = books.filter(book => book.year?.toString() === this.selectedYear());
    }

    if (this.selectedLanguage()) {
      books = books.filter(book => book.language === this.selectedLanguage());
    }

    return books;
  });

  constructor(private router: Router) {}

  onSearch(): void {
    console.log('Buscando:', this.searchQuery());
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  onAdvancedSearch(): void {
    // MODIFICACIÓN CLAVE: Alternar la visibilidad de los filtros avanzados
    this.showFilters.update(currentValue => !currentValue);
    console.log('Filtros avanzados:', this.showFilters() ? 'Visible' : 'Oculto');
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

  onBookClick(bookId: number): void {
    console.log('Ver detalles del libro:', bookId);
    alert(`Ver detalles del libro #${bookId}`);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
