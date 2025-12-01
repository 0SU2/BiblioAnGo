import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { CommunityService, AutorDTO, EditorialDTO } from '../../core/services/community';

const CLUB_TYPES = ['niños','jovenes','avanzados'] as const;
type ClubType = typeof CLUB_TYPES[number];

interface Club {
  id: string;
  title: string;
  description: string;
  image: string;
  members: number;
  category: string;
  type: ClubType;
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
export class Community implements OnInit {

  private readonly _communityService = inject(CommunityService)
  searchQuery = signal('');
  showFilters = signal(false);
  joinedClubs = signal<Set<string>>(new Set());

  selectedType = signal('');
  selectedCategory = signal('');
  selectedMemberRange = signal('');

  showLoginModal = signal(false);
  modalMessage = signal('');

  clubTypes: FilterOption[] = [
    { value: '', label: 'Todos' },
    { value: CLUB_TYPES[0], label: 'Clubes para niños' },
    { value: CLUB_TYPES[1], label: 'Clubes para jóvenes' },
    { value: CLUB_TYPES[2], label: 'Clubes avanzados' }
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

  allClubs: Club[] = [];

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  fetchAllClubsAPI = this._communityService.fetchAllClubs

  filteredClubs = computed(() => {
    if(this.fetchAllClubsAPI.hasValue()) {
      let clubs = this.fetchAllClubsAPI.value()
      const query = this.normalizeText(this.searchQuery());
      if (query) {
        clubs = clubs.filter(club =>
          this.normalizeText(club.titulo).includes(query) ||
          this.normalizeText(club.descripcion).includes(query)
        );
      }
      if (this.selectedType()) {
        clubs = clubs.filter(club => club.tipo === this.selectedType());
      }

      if (this.selectedCategory()) {
        clubs = clubs.filter(club => club.categoria === this.selectedCategory());
      }

      if (this.selectedMemberRange()) {
        clubs = clubs.filter(club => {
          const range = this.selectedMemberRange();
          if (range === '0-50') return club.miembros <= 50;
          if (range === '51-100') return club.miembros > 50 && club.miembros <= 100;
          if (range === '101-200') return club.miembros > 100 && club.miembros <= 200;
          if (range === '200+') return club.miembros > 200;
          return true;
        });
      }
      return clubs;
    }

    return undefined;
  });

  popularClubs = computed(() =>
    this.allClubs.slice(0, 4)
  );

  recentClubs = computed(() =>
    this.allClubs.filter(club => club.tag === 'Nuevo').slice(0, 4)
  );

  constructor(
    private router: Router,
    public auth: Auth,
  ) {}

  ngOnInit() { }

  onSearch(): void {
    // filtrado automático
  }

  onAdvancedSearch(): void {
    this.showFilters.update(currentValue => !currentValue);
  }

  clearFilters(): void {
    this.selectedType.set('');
    this.selectedCategory.set('');
    this.selectedMemberRange.set('');
  }

  onClubClick(clubId: string): void {
    console.log('Ver detalles del club:', clubId);
    alert(`Ver detalles del club ${clubId}`);
  }

  onJoinClub(clubId: string, event: Event): void {
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

  isJoined(clubId: string): boolean {
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
