import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Character {
  name: string;
}

@Component({
  selector: 'app-create-story',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-story.html',
})
export class CreateStory {
  // Formulario
  title = signal('');
  category = signal('');
  ageRating = signal('');
  status = signal('progreso');
  language = signal('español');
  description = signal('');
  tags = signal<string[]>([]);
  characters = signal<Character[]>([]);
  frequency = signal('libre');
  coverImage = signal<string | null>(null);

  // UI
  newTag = signal('');
  newCharacter = signal('');

  // Opciones de dropdowns
  categories = [
    'Fantasía',
    'Romance',
    'Ciencia ficción',
    'Misterio',
    'Terror',
    'Aventura',
    'Drama',
    'Comedia'
  ];

  ageRatings = [
    { value: 'todo-publico', label: 'Todo público' },
    { value: 'adolescente', label: 'Adolescente (+13)' },
    { value: 'maduro', label: 'Maduro (+16)' },
    { value: 'adulto', label: 'Adulto (+18)' }
  ];

  statuses = [
    { value: 'progreso', label: 'En progreso' },
    { value: 'completa', label: 'Completa' },
    { value: 'pausa', label: 'En pausa' }
  ];

  languages = [
    { value: 'español', label: 'Español' },
    { value: 'ingles', label: 'Inglés' },
    { value: 'portugues', label: 'Portugués' },
    { value: 'frances', label: 'Francés' }
  ];

  frequencies = [
    { value: 'libre', label: 'Libre' },
    { value: 'diario', label: 'Diario' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensual', label: 'Mensual' }
  ];

  constructor(private router: Router) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        this.coverImage.set(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  addTag(): void {
    const tag = this.newTag().trim();
    if (tag && !this.tags().includes(tag)) {
      this.tags.update(tags => [...tags, tag]);
      this.newTag.set('');
    }
  }

  removeTag(tag: string): void {
    this.tags.update(tags => tags.filter(t => t !== tag));
  }

  addCharacter(): void {
    const name = this.newCharacter().trim();
    if (name) {
      this.characters.update(chars => [...chars, { name }]);
      this.newCharacter.set('');
    }
  }

  removeCharacter(index: number): void {
    this.characters.update(chars => chars.filter((_, i) => i !== index));
  }

  onCancel(): void {
    if (confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los cambios.')) {
      this.router.navigate(['/stories']);
    }
  }

  onSkip(): void {
    console.log('Guardando información básica y saltando al editor...');
    // Guardar información básica si hay al menos un título
    if (this.title().trim()) {
      this.router.navigate(['/create-chapter', 'new']);
    } else {
      alert('Por favor, ingresa al menos un título antes de continuar al editor');
    }
  }

  onSave(): void {
    if (!this.title().trim()) {
      alert('Por favor, ingresa un título para tu historia');
      return;
    }

    if (!this.category()) {
      alert('Por favor, selecciona una categoría');
      return;
    }

    if (!this.ageRating()) {
      alert('Por favor, selecciona una clasificación de edad');
      return;
    }

    if (!this.description().trim()) {
      alert('Por favor, ingresa una descripción');
      return;
    }

    console.log('Guardando historia completa:', {
      title: this.title(),
      category: this.category(),
      ageRating: this.ageRating(),
      status: this.status(),
      language: this.language(),
      description: this.description(),
      tags: this.tags(),
      characters: this.characters(),
      frequency: this.frequency(),
      coverImage: this.coverImage()
    });

    alert('¡Historia guardada exitosamente!');
    // Redirigir al editor para crear el primer capítulo
    this.router.navigate(['/create-chapter', 'new']);
  }
}
