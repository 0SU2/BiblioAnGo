import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { Auth } from '../../core/services/auth';

interface Story {
  id: number;
  title: string;
  chapters: number;
  coverImage: string;
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

  allStories: Story[] = [
    {
      id: 1,
      title: "Creator's Call",
      chapters: 96,
      coverImage: '/assets/stories/creators-call.jpg',
      lastUpdated: 'Julio. 26, 2024 - 1:20 AM',
      views: 1004,
      likes: 456,
      comments: 225,
      status: 'published'
    },
    {
      id: 2,
      title: 'The Flight of the Darkstar Dragon',
      chapters: 105,
      coverImage: '/assets/stories/darkstar-dragon.jpg',
      lastUpdated: 'Mar. 22, 2025 - 11:59 PM',
      views: 5452,
      likes: 453,
      comments: 682,
      status: 'published'
    },
    {
      id: 3,
      title: 'Shadows of Tomorrow',
      chapters: 42,
      coverImage: '/assets/stories/shadows.jpg',
      lastUpdated: 'Nov. 15, 2024 - 3:45 PM',
      views: 892,
      likes: 234,
      comments: 156,
      status: 'published'
    },
    {
      id: 4,
      title: 'The Last Kingdom',
      chapters: 8,
      coverImage: '/assets/stories/kingdom.jpg',
      lastUpdated: 'Ago. 10, 2024 - 9:30 PM',
      views: 245,
      likes: 67,
      comments: 34,
      status: 'draft'
    },
    {
      id: 5,
      title: 'Whispers in the Wind',
      chapters: 67,
      coverImage: '/assets/stories/whispers.jpg',
      lastUpdated: 'Sep. 5, 2024 - 2:15 PM',
      views: 3421,
      likes: 789,
      comments: 445,
      status: 'published'
    },
    {
      id: 6,
      title: 'Chronicles of Eternity',
      chapters: 15,
      coverImage: '/assets/stories/chronicles.jpg',
      lastUpdated: 'Oct. 20, 2024 - 8:00 AM',
      views: 567,
      likes: 123,
      comments: 89,
      status: 'draft'
    }
  ];

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
    public auth: Auth
  ) {}

  selectTab(tab: 'all' | 'published' | 'drafts'): void {
    this.selectedTab.set(tab);
  }

  onCreateStory(): void {
    console.log('Crear nueva historia');
    this.router.navigate(['/create-story']);
  }

  onStoryClick(storyId: number): void {
    console.log('Ver detalles de la historia:', storyId);
    alert(`Ver detalles de la historia #${storyId}`);
  }

  onEditStory(storyId: number, event: Event): void {
    event.stopPropagation();
    console.log('Editar historia:', storyId);
    this.router.navigate(['/editor', storyId]);
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

  onDeleteStory(storyId: number, event: Event): void {
    event.stopPropagation();
    const confirmed = confirm('¿Estás seguro de que deseas eliminar esta historia?');

    if (confirmed) {
      console.log('Eliminar historia:', storyId);
      alert(`Historia #${storyId} eliminada`);
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
