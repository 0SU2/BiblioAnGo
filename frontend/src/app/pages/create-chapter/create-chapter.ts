import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-chapter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-chapter.html',
})
export class CreateChapter {
  @ViewChild('contentTextarea') contentTextarea!: ElementRef<HTMLTextAreaElement>;

  chapterTitle = signal('Parte 1 Sin Título');
  chapterContent = signal('');
  storyId: string | null = null;

  // Estados del editor
  showPreview = signal(false);
  currentAlignment = signal<'left' | 'center' | 'right'>('left');

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.storyId = this.route.snapshot.paramMap.get('id');
  }

  onBack(): void {
    if (this.chapterContent().trim()) {
      if (confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
        this.router.navigate(['/stories']);
      }
    } else {
      this.router.navigate(['/stories']);
    }
  }

  onAddImage(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          this.insertAtCursor(`\n[Imagen: ${file.name}]\n`);
          console.log('Imagen agregada:', imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  onAddVideo(): void {
    const url = prompt('Ingresa la URL del video (YouTube, Vimeo, etc.):');
    if (url) {
      this.insertAtCursor(`\n[Video: ${url}]\n`);
      console.log('Video agregado:', url);
    }
  }

  onSaveDraft(): void {
    console.log('Guardando borrador:', {
      title: this.chapterTitle(),
      content: this.chapterContent(),
      storyId: this.storyId
    });
    alert('Borrador guardado exitosamente');
  }

  onTogglePreview(): void {
    this.showPreview.update(v => !v);
  }

  onPublish(): void {
    if (!this.chapterContent().trim()) {
      alert('Por favor, escribe contenido para tu capítulo antes de publicar');
      return;
    }

    if (confirm('¿Estás seguro de que deseas publicar este capítulo?')) {
      console.log('Publicando capítulo:', {
        title: this.chapterTitle(),
        content: this.chapterContent(),
        storyId: this.storyId
      });
      alert('¡Capítulo publicado exitosamente!');
      this.router.navigate(['/stories']);
    }
  }

  // Métodos de formato de texto
  wrapSelectedText(before: string, after: string = before): void {
    const textarea = this.contentTextarea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.chapterContent().substring(start, end);

    if (selectedText) {
      const newText =
        this.chapterContent().substring(0, start) +
        before + selectedText + after +
        this.chapterContent().substring(end);

      this.chapterContent.set(newText);

      // Restaurar el foco y la selección
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + before.length,
          end + before.length
        );
      }, 0);
    } else {
      // Si no hay selección, insertar marcadores
      this.insertAtCursor(before + after);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length);
      }, 0);
    }
  }

  toggleBold(): void {
    this.wrapSelectedText('**');
  }

  toggleItalic(): void {
    this.wrapSelectedText('*');
  }

  toggleUnderline(): void {
    this.wrapSelectedText('__');
  }

  insertLink(): void {
    const url = prompt('Ingresa la URL:');
    if (url) {
      const text = prompt('Texto del enlace:', 'enlace');
      if (text) {
        this.wrapSelectedText(`[${text}](${url})`);
      }
    }
  }

  insertList(): void {
    this.insertAtCursor('\n• ');
  }

  insertQuote(): void {
    this.insertAtCursor('\n> ');
  }

  setAlignment(align: 'left' | 'center' | 'right'): void {
    this.currentAlignment.set(align);
    const textarea = this.contentTextarea?.nativeElement;
    if (textarea) {
      textarea.style.textAlign = align;
    }
  }

  private insertAtCursor(text: string): void {
    const textarea = this.contentTextarea?.nativeElement;
    if (!textarea) {
      this.chapterContent.set(this.chapterContent() + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText =
      this.chapterContent().substring(0, start) +
      text +
      this.chapterContent().substring(end);

    this.chapterContent.set(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  }

  // Convertir markdown a HTML para vista previa
  parseMarkdown(text: string): string {
    let html = text;

    // Negritas **text**
    html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');

    // Cursiva *text*
    html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');

    // Subrayado __text__
    html = html.replace(/__([^_]+)__/g, '<u>$1</u>');

    // Enlaces [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>');

    // Listas •
    html = html.replace(/^• (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc ml-6 my-2">$1</ul>');

    // Citas >
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-2">$1</blockquote>');

    // Saltos de línea
    html = html.replace(/\n/g, '<br>');

    return html;
  }
}
