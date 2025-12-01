import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface Video {
  id: number;
  title: string;
  duration: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './help.html',
})
export class Help {

  searchQuery = signal('');
  openFAQs = signal<Set<number>>(new Set());

  faqs: FAQ[] = [
    {
      id: 1,
      question: '¿Cómo puedo registrarme en BiblioAnGo?',
      answer: 'Para registrarte, haz clic en el botón "Registrarse" en la página principal. Completa el formulario con tu nombre, correo electrónico y crea una contraseña segura. Recibirás un correo de confirmación para activar tu cuenta.',
      category: 'cuenta'
    },
    {
      id: 2,
      question: '¿Cómo solicito un préstamo de libro?',
      answer: 'Busca el libro que deseas en el catálogo, haz clic en él para ver los detalles y presiona el botón "Leer". El libro estará disponible en tu biblioteca personal inmediatamente.',
      category: 'prestamos'
    },
    {
      id: 3,
      question: '¿Cuántos libros puedo tener prestados a la vez?',
      answer: 'Puedes tener hasta 5 libros prestados simultáneamente. Una vez que termines de leer uno, podrás solicitar otro.',
      category: 'prestamos'
    },
    {
      id: 4,
      question: '¿Cuál es el plazo de devolución de un libro?',
      answer: 'El plazo estándar de préstamo es de 14 días. Puedes renovar el préstamo si no hay otros usuarios esperando por ese libro.',
      category: 'prestamos'
    },
    {
      id: 5,
      question: '¿Cómo agrego libros a mis favoritos?',
      answer: 'Haz clic en el icono de corazón que aparece en cada libro. Los libros favoritos se guardan en tu perfil para que puedas acceder a ellos fácilmente.',
      category: 'funciones'
    },
    {
      id: 6,
      question: '¿Puedo descargar libros para leer sin conexión?',
      answer: 'Sí, puedes descargar los libros prestados en formato PDF o EPUB para leerlos sin conexión desde tu dispositivo.',
      category: 'funciones'
    },
    {
      id: 7,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a Configuración > Perfil de Usuario y busca la opción "Cambiar contraseña". Necesitarás tu contraseña actual para confirmar el cambio.',
      category: 'cuenta'
    },
    {
      id: 8,
      question: '¿Qué hago si olvidé mi contraseña?',
      answer: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.',
      category: 'cuenta'
    },
    {
      id: 9,
      question: '¿Puedo sugerir libros para agregar al catálogo?',
      answer: 'Sí, ve a la sección Comunidad y usa el formulario de sugerencias. Nuestro equipo revisará tu solicitud y te notificará cuando el libro esté disponible.',
      category: 'comunidad'
    },
    {
      id: 10,
      question: '¿Cómo reporto un problema técnico?',
      answer: 'Puedes reportar problemas a través del correo soporte@biblioango.com o usando el botón "Reportar problema" en la sección de ayuda. Incluye detalles del problema y capturas de pantalla si es posible.',
      category: 'soporte'
    }
  ];

  videos: Video[] = [
    {
      id: 1,
      title: 'Introducción a BiblioAnGo',
      duration: '3:45'
    },
    {
      id: 2,
      title: 'Cómo solicitar tu primer préstamo',
      duration: '2:30'
    },
    {
      id: 3,
      title: 'Gestiona tu biblioteca personal',
      duration: '4:15'
    },
    {
      id: 4,
      title: 'Personaliza tu perfil',
      duration: '3:00'
    }
  ];

  // Función para normalizar texto (eliminar acentos)
  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  // FAQs filtradas por búsqueda
  filteredFAQs = computed(() => {
    const query = this.normalizeText(this.searchQuery());

    if (!query) {
      return this.faqs;
    }

    return this.faqs.filter(faq =>
      this.normalizeText(faq.question).includes(query) ||
      this.normalizeText(faq.answer).includes(query)
    );
  });

  filterQuestions(): void {
    // La búsqueda se actualiza automáticamente con el signal computed
    console.log('Buscando:', this.searchQuery());
  }

  toggleFAQ(id: number): void {
    const openSet = new Set(this.openFAQs());

    if (openSet.has(id)) {
      openSet.delete(id);
    } else {
      openSet.add(id);
    }

    this.openFAQs.set(openSet);
  }
}
