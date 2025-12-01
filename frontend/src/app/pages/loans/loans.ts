import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';
import { UserService, LoanDTO } from '../../core/services/user';
import { Auth } from '../../core/services/auth';

interface LoanVM {
  id: string;
  titulo: string;
  isbn: string;
  imagen: string;
  fecha_creacion: string;
  fecha_entrega?: string;
  estatus: 'pendiente' | 'activo' | 'finalizado';
  usuario_nombre?: string;
  usuario_apaterno?: string;
  usuario_correo?: string;
  usuario_telefono?: string;
  usuario_avatar?: string;
}

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './loans.html',
})
export class Loans {
  searchQuery = signal('');
  selectedStatus = signal<'all' | 'pendiente' | 'activo' | 'finalizado'>('all');
  showPendingOnly = false;

  allLoans = signal<LoanVM[]>([]);

  // Inyectar servicios
  private auth = inject(Auth);
  private user = inject(UserService);
  public router = inject(Router);

  // Acceder al valor del signal currentUser()
  isAdmin = computed(() => {
    return this.auth.currentUser()?.rol === 'administrador';
  });

  private normalizeText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  filteredLoans = computed(() => {
    const query = this.normalizeText(this.searchQuery());
    const status = this.selectedStatus();
    let items = this.allLoans();

    if (status !== 'all') {
      items = items.filter(l => l.estatus === status);
    }

    if (query) {
      items = items.filter(l => {
        const searchable = `${l.titulo} ${l.isbn} ${l.usuario_nombre || ''} ${l.usuario_apaterno || ''} ${l.usuario_correo || ''}`;
        return this.normalizeText(searchable).includes(query);
      });
    }

    if (this.isAdmin() && this.showPendingOnly) {
      items = items.filter(l => l.estatus === 'pendiente');
    }

    return items;
  });

  pendingLoans = computed(() => this.allLoans().filter(l => l.estatus === 'pendiente'));
  activeLoans = computed(() => this.allLoans().filter(l => l.estatus === 'activo'));
  finishedLoans = computed(() => this.allLoans().filter(l => l.estatus === 'finalizado'));

  ngOnInit() {
    this.loadLoans();
  }

  private loadLoans() {
    try {
      if (this.isAdmin()) {
        console.log('Cargando vista de administrador...');
        this.allLoans.set(this.generateSampleLoans(true));
      } else {
        console.log('Cargando vista de usuario normal...');
        this.allLoans.set(this.generateSampleLoans(false));
      }
    } catch (e) {
      console.error('Error cargando préstamos', e);
      this.allLoans.set(this.generateSampleLoans(false));
    }
  }

  // Generar datos de ejemplo según el rol
  private generateSampleLoans(isAdmin: boolean): LoanVM[] {
    const sampleAdminLoans: LoanVM[] = [
      {
        id: '1',
        titulo: 'Cien años de soledad',
        isbn: '001A',
        imagen: 'https://m.media-amazon.com/images/I/81iqZ2HHD-L.jpg',
        fecha_creacion: '2024-01-15',
        fecha_entrega: '2024-02-15',
        estatus: 'pendiente',
        usuario_nombre: 'Juan',
        usuario_apaterno: 'Pérez',
        usuario_correo: 'juan@example.com',
        usuario_telefono: '555-1234',
        usuario_avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez&background=random'
      },
      {
        id: '2',
        titulo: 'Don Quijote de la Mancha',
        isbn: '002A',
        imagen: 'https://m.media-amazon.com/images/I/81NqpGXGczL.jpg',
        fecha_creacion: '2024-01-10',
        fecha_entrega: '2024-02-10',
        estatus: 'activo',
        usuario_nombre: 'María',
        usuario_apaterno: 'González',
        usuario_correo: 'maria@example.com',
        usuario_telefono: '555-5678',
        usuario_avatar: 'https://ui-avatars.com/api/?name=María+González&background=random'
      },
      {
        id: '3',
        titulo: 'El gran Gatsby',
        isbn: '003A',
        imagen: 'https://m.media-amazon.com/images/I/81af+MCATTL.jpg',
        fecha_creacion: '2023-12-20',
        fecha_entrega: '2024-01-20',
        estatus: 'finalizado',
        usuario_nombre: 'Carlos',
        usuario_apaterno: 'Rodríguez',
        usuario_correo: 'carlos@example.com',
        usuario_telefono: '555-9012',
        usuario_avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodríguez&background=random'
      }
    ];

    const sampleUserLoans: LoanVM[] = [
      {
        id: '4',
        titulo: '1984',
        isbn: '002B',
        imagen: 'https://m.media-amazon.com/images/I/71rpa1-6mdL.jpg',
        fecha_creacion: '2024-01-05',
        fecha_entrega: '2024-02-05',
        estatus: 'activo'
      },
      {
        id: '5',
        titulo: 'Moby Dick',
        isbn: '001B',
        imagen: 'https://m.media-amazon.com/images/I/91hFTj6d-6L.jpg',
        fecha_creacion: '2024-01-12',
        fecha_entrega: '2024-02-12',
        estatus: 'activo'
      },
      {
        id: '6',
        titulo: 'Orgullo y prejuicio',
        isbn: '003B',
        imagen: 'https://m.media-amazon.com/images/I/81-+8jN8YjL.jpg',
        fecha_creacion: '2023-12-15',
        fecha_entrega: '2024-01-15',
        estatus: 'finalizado'
      }
    ];

    return isAdmin ? sampleAdminLoans : sampleUserLoans;
  }

  // Métodos de acción para admin - CORREGIDOS con cast explícito
  approveLoan(loanId: string) {
    if (confirm('¿Autorizar este préstamo?')) {
      console.log('Autorizando préstamo:', loanId);
      const updatedLoans = this.allLoans().map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            estatus: 'activo' as const // Cast explícito
          };
        }
        return loan;
      });
      this.allLoans.set(updatedLoans);
    }
  }

  rejectLoan(loanId: string) {
    if (confirm('¿Rechazar este préstamo?')) {
      console.log('Rechazando préstamo:', loanId);
      const updatedLoans = this.allLoans().filter(loan => loan.id !== loanId);
      this.allLoans.set(updatedLoans);
    }
  }

  markAsReturned(loanId: string) {
    if (confirm('¿Marcar este libro como devuelto?')) {
      console.log('Marcando como devuelto:', loanId);
      const updatedLoans = this.allLoans().map(loan => {
        if (loan.id === loanId) {
          return {
            ...loan,
            estatus: 'finalizado' as const // Cast explícito
          };
        }
        return loan;
      });
      this.allLoans.set(updatedLoans);
    }
  }

  viewDetails(loanId: string) {
    console.log('Ver detalles:', loanId);
  }

  exportLoans() {
    console.log('Exportando...');
    alert('Funcionalidad de exportación en desarrollo');
  }

  selectStatus(status: 'all' | 'pendiente' | 'activo' | 'finalizado') {
    this.selectedStatus.set(status);
  }

  onLoanClick(isbn: string) {
    this.router.navigate(['/book', isbn]);
  }

  onSearch() {
    console.log('Búsqueda:', this.searchQuery());
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDaysRemaining(deliveryDate?: string): number | null {
    if (!deliveryDate) return null;
    const today = new Date();
    const delivery = new Date(deliveryDate);
    if (isNaN(delivery.getTime())) return null;
    const diff = delivery.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  abs(value: number): number {
    return Math.abs(value);
  }
}
