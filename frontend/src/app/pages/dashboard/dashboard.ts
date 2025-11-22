import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  rating: number;
  tag?: string;
  category: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    Footer,
    RouterLink,
    FormsModule
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  showLoginModal = signal(false);
  modalMessage = signal('');
  favoriteBooks = signal<Set<number>>(new Set());
  searchQuery = signal('');
  selectedCategory = signal('all');

  // Catálogo completo de libros
  allBooks: Book[] = [
    {
      id: 1,
      title: 'Más allá de las estrellas',
      author: 'Neil Stenson',
      image: '/assets/books/book1.jpg',
      rating: 5,
      tag: 'Popular',
      category: 'destacados'
    },
    {
      id: 2,
      title: 'Dino Rhymes',
      author: 'Illustrated Stories',
      image: '/assets/books/book2.jpg',
      rating: 4,
      category: 'destacados'
    },
    {
      id: 3,
      title: 'Cada Historia Cuenta',
      author: 'Editorial Norma',
      image: '/assets/books/book3.jpg',
      rating: 5,
      tag: 'Nuevo',
      category: 'destacados'
    },
    {
      id: 4,
      title: 'Argonauta',
      author: 'Sci-Fi Adventure',
      image: '/assets/books/book4.jpg',
      rating: 5,
      category: 'destacados'
    },
    {
      id: 5,
      title: 'Manuales Educativos',
      author: 'Colección',
      image: '/assets/books/book5.jpg',
      rating: 4,
      category: 'destacados'
    },
    {
      id: 6,
      title: 'El Hobbit',
      author: 'J.R.R. Tolkien',
      image: '/assets/books/rec1.jpg',
      rating: 5,
      category: 'recomendados'
    }
  ];

  // Libros filtrados por búsqueda y categoría
  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();

    let books = this.allBooks;

    // Filtrar por categoría
    if (category !== 'all') {
      books = books.filter(book => book.category === category);
    }

    // Filtrar por búsqueda
    if (query) {
      books = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
      );
    }

    return books;
  });

  // Libros destacados filtrados
  featuredBooks = computed(() =>
    this.filteredBooks().filter(book => book.category === 'destacados')
  );

  // Libros recomendados filtrados
  recommendedBooks = computed(() =>
    this.filteredBooks().filter(book => book.category === 'recomendados')
  );

  constructor(
    public auth: Auth,
    private router: Router
  ) {}

  onSearch(): void {
    // La búsqueda se actualiza automáticamente con el signal
    console.log('Buscando:', this.searchQuery());
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
  }

  onBookClick(bookId: number): void {
    console.log('Ver detalles del libro:', bookId);
    alert(`Ver detalles del libro #${bookId}`);
  }

  onAddToFavorites(bookId: number, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('agregar este libro a favoritos');
      return;
    }

    const favorites = new Set(this.favoriteBooks());

    if (favorites.has(bookId)) {
      favorites.delete(bookId);
      console.log('Eliminado de favoritos:', bookId);
    } else {
      favorites.add(bookId);
      console.log('Agregado a favoritos:', bookId);
    }

    this.favoriteBooks.set(favorites);
  }

  isFavorite(bookId: number): boolean {
    return this.favoriteBooks().has(bookId);
  }

  onRequestLoan(bookId: number, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('leer este libro');
      return;
    }

    console.log('Solicitar préstamo:', bookId);
    alert(`Préstamo del libro #${bookId} solicitado`);
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
