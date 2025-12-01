import { Component, signal, computed, OnInit, Injectable } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common'; // <-- ¡NUEVO! Importamos el pipe
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { UserService } from '../../core/services/user';

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
  private mockBooks: BookDTO[] = [
    // Usamos datos simulados basados en la estructura SQL para el ejemplo
    {
      isbn: '001A',
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez', // Simplificado
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fellector.com.pa%2Fcdn%2Fshop%2Ffiles%2Fcien-anos-de-soledad.webp%3Fv%3D1731690530%26width%3D1100&f=1&nofb=1&ipt=813d6e4a5fe789ef8a9532cccdcf2c5689cb7d0a67aabf96bd6c092cdcd027f2',
      calificacion: 3,
      tag: 'popular',
      categoria: 'Poesia',
      prologo: 'Una saga familiar que muestra el realismo mágico en el pueblo ficticio de Macondo.',
      cantidad: 10,
      fecha_de_publicacion: '1967-06-05',
      no_paginas: '417',
      lenguaje: 'Español'
    },
    {
      isbn: '003B',
      titulo: 'Orgullo y prejuicio',
      autor: 'Jane Austen',
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpendulo.com%2Fimagenes_grandes%2F9788494%2F978849441163.GIF&f=1&nofb=1&ipt=0a9e3a62ae5ff9c6993eaf88397d7a1729f77135c7c96b7cd09e0dc9c2192c2f',
      calificacion: 4,
      tag: '',
      categoria: 'Suspenso',
      prologo: 'Un análisis de las relaciones y el matrimonio en la Inglaterra del siglo XIX.',
      cantidad: 4,
      fecha_de_publicacion: '1813-01-28',
      no_paginas: '432',
      lenguaje: 'Inglés'
    },
    {
      isbn: '006A',
      titulo: 'El proceso',
      autor: 'Autor Simulado',
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.polifemo.com%2Fstatic%2Fimg%2Fportadas%2F_visd_0000JPG02JU0.jpg&f=1&nofb=1&ipt=374db32f63af6d8bece7664f0d4c5dfb355aecbd47f421a2a380bb02e7af4eab',
      calificacion: 5,
      tag: 'nuevo',
      categoria: 'Suspenso',
      prologo: 'Un hombre es arrestado por un crimen que no entiende, reflejando la absurdidad del sistema judicial.',
      cantidad: 19,
      fecha_de_publicacion: '1925-08-10',
      no_paginas: '255',
      lenguaje: 'Español'
    },
    // Añadir el resto de los libros para simular la carga desde SQL
    {
      isbn: '002A',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.marcialpons.es%2Fmedia%2Fimg%2Fportadas%2F2023%2F4%2F18%2F9788408270881jfif&f=1&nofb=1&ipt=296903e218931f4c5faceda9d3c3d5763bffbddf0878d0944160155c04bc5fdf',
      calificacion: 2,
      tag: 'recomendado',
      categoria: 'Fantasia',
      prologo: 'La historia de un hidalgo que busca revivir la caballería, enfrentándose a la locura y la realidad.',
      cantidad: 2,
      fecha_de_publicacion: '1605-01-16',
      no_paginas: '863',
      lenguaje: 'Español'
    },
    {
      isbn: '001B',
      titulo: 'Moby Dick',
      autor: 'Autor Simulado 2',
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.senscritique.com%2Fmedia%2F000019481669%2Fsource_big%2FMoby_Dick.jpg&f=1&nofb=1&ipt=bbcaedf85f5f942e139c91abda22e4c6e599d8171934a0edddc9e13f738381b5',
      calificacion: 5,
      tag: 'popular',
      categoria: 'Épica',
      prologo: 'La obsesión del capitán Ahab por cazar a la gran ballena blanca.',
      cantidad: 3,
      fecha_de_publicacion: '1851-10-18',
      no_paginas: '635',
      lenguaje: 'Inglés'
    },
    {
      isbn: '004A',
      titulo: 'Crimen y castigo',
      autor: 'Autor Simulado 3',
      imagen: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.storytel.com%2Fimages%2Fe%2F640x640%2F0002060314.jpg&f=1&nofb=1&ipt=48955b80122de32d8821adba6c087b0fec57c0b651dd5c37c9e4a1ca7c4a474e',
      calificacion: 2,
      tag: 'recomendado',
      categoria: 'Fantasia',
      prologo: 'Un joven estudiante comete un asesinato y lidia con su culpa.',
      cantidad: 4,
      fecha_de_publicacion: '1866-01-01',
      no_paginas: '430',
      lenguaje: 'Español'
    },
  ];

  async getAllBooks(): Promise<BookDTO[]> {
    // Aquí iría el fetch real a la API, por ejemplo:
    // const res = await fetch(`${BASE_URL}/api/books`);
    // ...
    // Para la simulación:
    return new Promise(resolve => {
      setTimeout(() => resolve(this.mockBooks), 500); // Simula un pequeño retraso de red
    });
  }

  getBookByIsbn(isbn: string): BookDTO | undefined {
    return this.mockBooks.find(b => b.isbn === isbn);
  }
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
    UpperCasePipe // <-- ¡AÑADIDO! Esto soluciona el error del pipe
  ],
  templateUrl: './dashboard.html',
  // Asegúrate de que BookService esté disponible
  providers: [BookService]
})
// Implementamos OnInit para cargar datos al inicio
export class Dashboard implements OnInit {
  // Signals para modals
  showLoginModal = signal(false);
  showBookDetailModal = signal(false); // Nuevo modal para detalles
  modalMessage = signal('');

  // Signals para datos
  favoriteBooks = signal<Set<string>>(new Set()); // Ahora usa string (ISBN)
  allBooks = signal<BookDTO[]>([]); // Catálogo dinámico
  selectedBook = signal<BookDTO | null>(null); // Libro seleccionado para el detalle

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
        this.normalizeText(book.autor).includes(query)
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

  // Manejo de favoritos con persistencia
  async onAddToFavorites(isbn: string, event: Event): Promise<void> {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('agregar este libro a favoritos');
      return;
    }

    try {
      const favorites = new Set(this.favoriteBooks());

      if (favorites.has(isbn)) {
        await this.userService.removeFavorite(isbn); // Llamada al servicio DELETE
        favorites.delete(isbn);
        console.log('Eliminado de favoritos:', isbn);
      } else {
        await this.userService.addFavorite(isbn); // Llamada al servicio POST
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

  onRequestLoan(isbn: string, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('leer este libro');
      return;
    }

    console.log('Solicitar préstamo:', isbn);
    alert(`Préstamo del libro #${isbn} solicitado`);
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
    this.showBookDetailModal.set(false); // Cierra el modal de detalles
    this.selectedBook.set(null);
  }

  goToLogin(): void {
    this.closeModal();
    this.router.navigate(['/login']);
  }
}
