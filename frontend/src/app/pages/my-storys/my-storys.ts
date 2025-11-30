import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';
import { StoriesService, StoryDTO } from '../../core/services/stories';

interface Story {
  id: number;
  title: string;
  chapters: number;
  coverImage: string | null;
  lastUpdated: string;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'published';
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './my-storys.html',
})
export class Stories {
  selectedTab = signal<'all' | 'published' | 'drafts'>('all');
  showMonetizeModal = signal(false);
  selectedStoryId = signal<number | null>(null);
  selectedMonetizeOption = signal<'donate' | 'monetize'>('donate');

  // Estadísticas del usuario
  stats = {
    followers: 1300000,
    following: 200,
    storiesCreated: 26
  };

  allStories: Story[] = [];

  filteredStories = computed(() => {
    const tab = this.selectedTab();

    if (tab === 'all') {
      return this.allStories;
    } else if (tab === 'published') {
      return this.allStories.filter(story => story.status === 'published');
    } else {
      return this.allStories.filter(story => story.status === 'draft');
    }
  });

  constructor(
    private router: Router,
    public auth: Auth,
    private stories: StoriesService
  ) {}

  async ngOnInit() {
    await this.loadStories();
  }

  private async loadStories() {
    try {
      const items: StoryDTO[] = await this.stories.getMyStories();
      this.allStories = items.map(this.mapDtoToStory);
    } catch (e) {
      console.error('Error cargando historias', e);
    }
  }

  private mapDtoToStory = (dto: StoryDTO): Story => ({
    id: dto.id,
    title: dto.titulo,
    chapters: dto.capitulos ?? 0,
    coverImage: dto.cover ?? null,
    lastUpdated: dto.ultima_actualizacion,
    views: dto.vistas ?? 0,
    likes: dto.likes ?? 0,
    comments: dto.comentarios ?? 0,
    status: (dto.estatus === 'published' ? 'published' : 'draft')
  });

  selectTab(tab: 'all' | 'published' | 'drafts'): void {
    this.selectedTab.set(tab);
  }

  onCreateStory(): void {
    this.router.navigate(['/create-story']);
  }

  onStoryClick(storyId: number): void {
    console.log('Ver detalles de la historia:', storyId);
    alert(`Ver detalles de la historia #${storyId}`);
  }

  onEditStory(storyId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/create-chapter', storyId]);
  }

  onMonetizeStory(storyId: number, event: Event): void {
    event.stopPropagation();
    this.selectedStoryId.set(storyId);
    this.showMonetizeModal.set(true);
  }

  onViewStats(storyId: number, event: Event): void {
    event.stopPropagation();
    console.log('Ver estadísticas:', storyId);
    alert(`Estadísticas de la historia #${storyId}`);
  }

  onShareStory(storyId: number, event: Event): void {
    event.stopPropagation();
    console.log('Compartir historia:', storyId);
    alert(`Compartir historia #${storyId}`);
  }

  async onDeleteStory(storyId: number, event: Event): Promise<void> {
    event.stopPropagation();
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta historia?');

    if (confirmed) {
      try {
        await this.stories.deleteStory(storyId);
        await this.loadStories();
      } catch (e) {
        console.error('Error eliminando historia', e);
        alert('No fue posible eliminar la historia');
      }
    }
  }

  closeMonetizeModal(): void {
    this.showMonetizeModal.set(false);
    this.selectedStoryId.set(null);
  }

  selectMonetizeOption(option: 'donate' | 'monetize'): void {
    this.selectedMonetizeOption.set(option);
  }

  onConfirmMonetize(): void {
    const storyId = this.selectedStoryId();
    const option = this.selectedMonetizeOption();

    console.log(`Configurar ${option} para historia:`, storyId);
    alert(`Configuración de ${option === 'donate' ? 'donaciones' : 'monetización'} guardada para la historia #${storyId}`);

    this.closeMonetizeModal();
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
