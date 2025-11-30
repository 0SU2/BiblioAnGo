import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { CommunityService, AutorDTO, EditorialDTO } from '../../core/services/community';

const CLUB_TYPES = ['niños','jóvenes','avanzados'] as const;
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
export class Community {
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
    public auth: Auth,
    private community: CommunityService
  ) {}

  async ngOnInit() {
    try {
      const [autores, editoriales] = await Promise.all([
        this.community.getAuthors(),
        this.community.getEditorials()
      ]);

      const generated = [
        ...this.generateAuthorClubs(autores),
        ...this.generateEditorialClubs(editoriales)
      ];

      this.allClubs = generated;
    } catch (e) {
      console.error('Error cargando comunidad', e);
    }
  }

  private generateAuthorClubs(autores: AutorDTO[]): Club[] {
    return autores.slice(0, 12).map(a => ({
      id: `autor-${a.id_autor}`,
      title: `Club de ${a.nombre} ${a.apaterno}${a.amaterno ? ' ' + a.amaterno : ''}`.trim(),
      description: `Comunidad para fans de ${a.nombre} ${a.apaterno}`,
      image: '/assets/clubs/club-lectura.jpg',
      members: Math.floor(Math.random() * 300) + 20,
      category: 'lectura',
      type: CLUB_TYPES[Math.floor(Math.random()*CLUB_TYPES.length)] as ClubType,
      tag: Math.random() > 0.7 ? 'Nuevo' : undefined,
    }));
  }

  private generateEditorialClubs(editoriales: EditorialDTO[]): Club[] {
    return editoriales.slice(0, 8).map(e => ({
      id: `editorial-${e.id_editoria}`,
      title: `Editorial ${e.Nombre}`,
      description: `Club para lectores de ${e.Nombre}`,
      image: '/assets/clubs/literatura.jpg',
      members: Math.floor(Math.random() * 200) + 50,
      category: 'literatura',
      type: CLUB_TYPES[Math.floor(Math.random()*CLUB_TYPES.length)] as ClubType,
      tag: Math.random() > 0.5 ? 'Popular' : undefined,
    }));
  }

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
