import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';

interface Club {
  id: number;
  title: string;
  description: string;
  image: string;
  members: number;
  category: string;
  type: 'niños' | 'jóvenes' | 'avanzados';
  tag?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './community.html',
})
export class Community {
  searchQuery = signal('');
  showFilters = signal(false);
  joinedClubs = signal<Set<number>>(new Set());

  selectedType = signal('');
  selectedCategory = signal('');
  selectedMemberRange = signal('');

  showLoginModal = signal(false);
  modalMessage = signal('');

  clubTypes: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: 'niños', label: 'Clubes para niños' },
    { value: 'jóvenes', label: 'Clubes para jóvenes' },
    { value: 'avanzados', label: 'Clubes avanzados' }
  ];

  categories: FilterOption[] = [
    { value: '', label: 'Todas' },
    { value: 'lectura', label: 'Lectura' },
    { value: 'literatura', label: 'Literatura' },
    { value: 'escritura', label: 'Escritura' },
    { value: 'debate', label: 'Debate' }
  ];

  memberRanges: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: '0-50', label: '0-50 miembros' },
    { value: '51-100', label: '51-100 miembros' },
    { value: '101-200', label: '101-200 miembros' },
    { value: '200+', label: '200+ miembros' }
  ];

  allClubs: Club[] = [
    {
      id: 1,
      title: 'Leer Cambia Todo',
      description: 'Un espacio para compartir el amor por la lectura y descubrir nuevos mundos',
      image: '/assets/clubs/leer-cambia.jpg',
      members: 245,
      category: 'lectura',
      type: 'jóvenes',
      tag: 'Popular'
    },
    {
      id: 2,
      title: 'Club de Lectura',
      description: 'Únete a nuestras discusiones semanales sobre grandes obras literarias',
      image: '/assets/clubs/club-lectura.jpg',
      members: 189,
      category: 'lectura',
      type: 'avanzados'
    },
    {
      id: 3,
      title: 'Lenguaje y Literatura',
      description: 'Explorando los secretos del lenguaje y la expresión literaria',
      image: '/assets/clubs/literatura.jpg',
      members: 156,
      category: 'literatura',
      type: 'jóvenes'
    },
    {
      id: 4,
      title: 'Club de Fantasía',
      description: 'Para amantes de mundos mágicos y aventuras épicas',
      image: '/assets/clubs/fantasia.jpg',
      members: 312,
      category: 'lectura',
      type: 'jóvenes',
      tag: 'Nuevo'
    },
    {
      id: 5,
      title: 'Literatura Contemporánea',
      description: 'Discutimos las obras más relevantes de la literatura actual',
      image: '/assets/clubs/literatura-reciente.jpg',
      members: 98,
      category: 'literatura',
      type: 'avanzados',
      tag: 'Nuevo'
    },
    {
      id: 6,
      title: 'Cuentos de Otoño',
      description: 'Compartiendo historias que nos inspiran en cada estación',
      image: '/assets/clubs/cuentos-otono.jpg',
      members: 127,
      category: 'escritura',
      type: 'jóvenes'
    },
    {
      id: 7,
      title: 'Reading Makes You Better',
      description: 'English reading club for language learners',
      image: '/assets/clubs/reading-better.jpg',
      members: 203,
      category: 'lectura',
      type: 'avanzados'
    },
    {
      id: 8,
      title: 'Pequeños Lectores',
      description: 'Club de lectura para los más pequeños de la casa',
      image: '/assets/clubs/kids-club.jpg',
      members: 78,
      category: 'lectura',
      type: 'niños'
    }
  ];

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  filteredClubs = computed(() => {
    let clubs = this.allClubs;
    const query = this.normalizeText(this.searchQuery());

    if (query) {
      clubs = clubs.filter(club =>
        this.normalizeText(club.title).includes(query) ||
        this.normalizeText(club.description).includes(query)
      );
    }

    if (this.selectedType()) {
      clubs = clubs.filter(club => club.type === this.selectedType());
    }

    if (this.selectedCategory()) {
      clubs = clubs.filter(club => club.category === this.selectedCategory());
    }

    if (this.selectedMemberRange()) {
      clubs = clubs.filter(club => {
        const range = this.selectedMemberRange();
        if (range === '0-50') return club.members <= 50;
        if (range === '51-100') return club.members > 50 && club.members <= 100;
        if (range === '101-200') return club.members > 100 && club.members <= 200;
        if (range === '200+') return club.members > 200;
        return true;
      });
    }

    return clubs;
  });

  popularClubs = computed(() =>
    this.allClubs.slice(0, 4)
  );

  recentClubs = computed(() =>
    this.allClubs.filter(club => club.tag === 'Nuevo').slice(0, 4)
  );

  constructor(
    private router: Router,
    public auth: Auth
  ) {}

  onSearch(): void {
    console.log('Buscando:', this.searchQuery());
  }

  onAdvancedSearch(): void {
    this.showFilters.update(currentValue => !currentValue);
  }

  clearFilters(): void {
    this.selectedType.set('');
    this.selectedCategory.set('');
    this.selectedMemberRange.set('');
  }

  onClubClick(clubId: number): void {
    console.log('Ver detalles del club:', clubId);
    alert(`Ver detalles del club #${clubId}`);
  }

  onJoinClub(clubId: number, event: Event): void {
    event.stopPropagation();

    if (!this.auth.isLoggedIn()) {
      this.showLoginRequired('unirte a este club');
      return;
    }

    const joined = new Set(this.joinedClubs());

    if (joined.has(clubId)) {
      joined.delete(clubId);
    } else {
      joined.add(clubId);
    }

    this.joinedClubs.set(joined);
  }

  isJoined(clubId: number): boolean {
    return this.joinedClubs().has(clubId);
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
