import { Component, signal, computed, OnInit, Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { UserService } from '../../core/services/user';
import { LibroANDAutor } from '../../core/services/books';

// --- Simulación de DTOs y Servicio de Libros ---

// Interfaz que simula los datos que vendrán de la API/SQL
export interface BookDTO {
  isbn: string;
  titulo: string;
  autor: string; // Simplificamos, en la BD es autor_id
  imagen: string;
  calificacion: number; // Mapeado de 'calificacion' en SQL
  tag?: string; // Mapeado de 'tag' en SQL
  categoria: string; // Mapeado de 'categoria' en SQL
  prologo: string; // Nuevo campo para detalles
  cantidad: number; // Nuevo campo para stock
  fecha_de_publicacion: string;
  no_paginas: string;
  lenguaje: string;
}

// Simulación de BookService para obtener los libros del backend
// En una aplicación real, este servicio haría la llamada al endpoint /api/books
@Injectable({ providedIn: 'root' })
export class BookService {

  async getAllBooks(): Promise<LibroANDAutor[]> {
    const BASE_URL = 'http://localhost:8080';
    // Aquí iría el fetch real a la API, por ejemplo:
    try {
      const res = await (await fetch(`${BASE_URL}/api/allBooksWithAutor`)).json() as { data: LibroANDAutor[] };
      return res.data;
    } catch (error) {
      throw error
    }
    // ...
    // Para la simulación:
    // return new Promise(resolve => {
    //   setTimeout(() => resolve(this.mockBooks), 500); // Simula un pequeño retraso de red
    // });
  }

  // async getBookByIsbn(isbn: string): Promise<BookDTO | undefined> {
  //   let temp = await this.getAllBooks().find(b => b.isbn === isbn);
  //   return temp
  // }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    Footer,
    RouterLink,
    FormsModule,
    UpperCasePipe
  ],
  templateUrl: './dashboard.html',
  // Asegúrate de que BookService esté disponible
  providers: [BookService]
})
// Implementamos OnInit para cargar datos al inicio
export class Dashboard implements OnInit {
  // Signals para modales
  showLoginModal = signal(false);
  showBookDetailModal = signal(false);
  modalMessage = signal('');

  // Signals para datos
  favoriteBooks = signal<Set<string>>(new Set());
  allBooks = signal<LibroANDAutor[]>([]);
  selectedBook = signal<LibroANDAutor | null>(null);

  // NUEVAS Signals para Préstamo/Lectura
  showLoanReadChoiceModal = signal(false); // Modal para elegir entre Préstamo/Lectura
  loanBookIsbn = signal<string | null>(null); // ISBN del libro seleccionado para la acción
  showLoanFormModal = signal(false); // Modal para detalles de préstamo

  // Variable para el formulario de préstamo
  loanDays: number = 7; // Valor por defecto del préstamo

  // Signals para filtros/búsqueda
  searchQuery = signal('');
  selectedCategory = signal('all');

  // Cargando estado
  isLoading = signal(true);

  // Funcion normalizacion de acentos
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // Libros filtrados por búsqueda y categoría
  filteredBooks = computed(() => {
    const query = this.normalizeText(this.searchQuery());
    const category = this.selectedCategory();
    let books = this.allBooks();

    // Filtrar por categoría (ahora usa la categoría de SQL: 'Poesia', 'Fantasia', etc.)
    if (category !== 'all') {
      // Usamos includes para buscar tags y categorías de la simulación
      books = books.filter(book => this.normalizeText(book.categoria).includes(category) || (book.tag && this.normalizeText(book.tag).includes(category)));
    }

    // Filtrar por búsqueda
    if (query) {
      books = books.filter(book =>
        this.normalizeText(book.titulo).includes(query) ||
        this.normalizeText(book.nombre_autor).includes(query)
      );
    }

    return books;
  });

  // Libros destacados filtrados
  // Ahora filtramos por el tag 'popular' o 'nuevo' de SQL, simulando la sección "Destacados"
  featuredBooks = computed(() =>
    this.filteredBooks().filter(book => book.tag === 'popular' || book.tag === 'nuevo')
  );

  // Libros recomendados filtrados
  // Ahora filtramos por el tag 'recomendado' de SQL
  recommendedBooks = computed(() =>
    this.filteredBooks().filter(book => book.tag === 'recomendado')
  );

  constructor(
    public auth: Auth,
    private router: Router,
    private userService: UserService, // Inyectamos UserService
    private bookService: BookService // Inyectamos BookService
  ) {}

  // Lógica de carga de datos al inicio
  async ngOnInit(): Promise<void> {
    await this.loadAllData();
  }

  // Carga los libros y los favoritos
  private async loadAllData(): Promise<void> {
    this.isLoading.set(true);
    try {
      // 1. Cargar todos los libros
      const books = await this.bookService.getAllBooks();
      this.allBooks.set(books);

      // 2. Cargar favoritos si está logueado
      if (this.auth.isLoggedIn()) {
        // La simulación de userService.getMyFavoriteBooks() está en el archivo original de la app.
        // Aquí simulamos que obtenemos los ISBNs favoritos.
        const favoriteDTOs = await this.userService.getMyFavoriteBooks();
        const favoriteISBNs = new Set(favoriteDTOs.map(fav => fav.isbn));
        this.favoriteBooks.set(favoriteISBNs);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Podrías mostrar un mensaje de error al usuario aquí
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearch(): void {
    console.log('Buscando:', this.searchQuery());
  }

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
  }

  // Muestra el modal de detalles del libro
  onBookClick(isbn: string): void {
    const book = this.allBooks().find(b => b.isbn === isbn);
    if (book) {
      this.selectedBook.set(book);
      this.showBookDetailModal.set(true);
    }
    console.log('Ver detalles del libro:', isbn);
  }

  // Manejo de favoritos con persistencia (con simulación de servicio)
  async onAddToFavorites(isbn: string, event: Event): Promise<void> {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('agregar este libro a favoritos');
      return;
    }

    try {
      const favorites = new Set(this.favoriteBooks());

      if (favorites.has(isbn)) {
        // En una app real, llamarías a un servicio para eliminar
        await this.userService.removeFavorite(isbn);
        favorites.delete(isbn);
        console.log('Eliminado de favoritos:', isbn);
      } else {
        // En una app real, llamarías a un servicio para agregar
        await this.userService.addFavorite(isbn);
        favorites.add(isbn);
        console.log('Agregado a favoritos:', isbn);
      }

      this.favoriteBooks.set(favorites);
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
      alert('Error al actualizar favoritos. Inténtalo de nuevo.');
    }
  }

  isFavorite(isbn: string): boolean {
    return this.favoriteBooks().has(isbn);
  }

  // MODIFICADO: Ahora abre el modal de elección.
  onRequestLoan(isbn: string, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('solicitar un préstamo o leer');
      return;
    }

    const book = this.allBooks().find(b => b.isbn === isbn);
    if (!book) return;

    this.loanDays = 7; // Resetear el valor del formulario por defecto

    // Si se llama desde la tarjeta, establecemos el libro y abrimos el modal de elección
    if (this.selectedBook()?.isbn !== isbn) {
        this.selectedBook.set(book);
    }

    // Cerramos el modal de detalles (si está abierto) y abrimos el modal de elección.
    this.showBookDetailModal.set(false);
    this.loanBookIsbn.set(isbn);
    this.showLoanReadChoiceModal.set(true);

    console.log('Abriendo selección de acción para libro:', isbn);
  }

  // NUEVO: Maneja la elección entre Préstamo y Lectura
  onLoanReadChoice(choice: 'loan' | 'read'): void {
    this.showLoanReadChoiceModal.set(false); // Cierra el modal de elección

    const isbn = this.loanBookIsbn();
    const book = this.allBooks().find(b => b.isbn === isbn);

    if (!isbn || !book) {
      alert('Error: Libro no encontrado.');
      this.closeAllModals();
      return;
    }

    if (choice === 'loan') {
      if (book.cantidad === 0) {
         alert(`El libro "${book.titulo}" está actualmente agotado para préstamo. No se puede solicitar.`);
         this.closeAllModals();
      } else {
        this.selectedBook.set(book);
        this.showLoanFormModal.set(true); // Abre el modal de formulario de préstamo
      }
    } else if (choice === 'read') {
      this.startReading(book.titulo);
    }
  }

  // NUEVO: Simula el envío del préstamo
  submitLoanRequest(isbn: string, days: number): void {
    if (!this.selectedBook()) return;

    // Aquí iría la llamada al servicio de backend para crear el registro de préstamo
    console.log(`Enviando solicitud de préstamo para ISBN: ${isbn} por ${days} días.`);

    alert(`Préstamo de "${this.selectedBook()!.titulo}" solicitado por ${days} días. Recibirás una notificación cuando sea aprobado.`);

    this.closeAllModals();
  }

  // NUEVO: Simula la vista de lectura
  startReading(title: string): void {
    // En una aplicación real, aquí se abriría una nueva ventana/ruta con el lector digital
    alert(`📖 Iniciando la lectura de "${title}". (Simulación de visor de lectura inmediata)`);
    this.closeAllModals();
  }


  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  private showLoginRequired(action: string): void {
    this.modalMessage.set(`Necesitas iniciar sesión para ${action}`);
    this.showLoginModal.set(true);
  }

  // NUEVO: Función maestra para cerrar todos los modales de acción
  closeAllModals(): void {
    this.showLoginModal.set(false);
    this.showBookDetailModal.set(false);
    this.showLoanReadChoiceModal.set(false);
    this.showLoanFormModal.set(false);
    this.selectedBook.set(null);
    this.loanBookIsbn.set(null);
  }

  goToLogin(): void {
    this.closeAllModals();
    this.router.navigate(['/login']);
  }
}
