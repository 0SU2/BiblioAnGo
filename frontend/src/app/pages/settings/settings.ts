import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    Header,
    Sidebar,
    Footer,
    FormsModule
  ],
  templateUrl: './settings.html',
})
export class Settings {

  showConfirmModal = signal(false);

  // Datos del perfil
  profileData = {
    name: 'Usuario Demo',
    email: 'usuario@ejemplo.com',
    bio: 'Amante de la lectura y la literatura clásica'
  };

  // Configuración de notificaciones
  notifications = {
    newBooks: true,
    recommendations: true,
    community: false
  };

  // Configuración de privacidad
  privacy = {
    publicProfile: true,
    showFavorites: true
  };

  // Configuración de apariencia
  appearance = {
    theme: 'light',
    fontSize: 'medium'
  };

  saveProfile(): void {
    console.log('Guardando perfil:', this.profileData);
    this.showConfirmModal.set(true);
  }

  clearCache(): void {
    if (confirm('¿Estás seguro de que deseas limpiar la caché? Esto puede afectar tu experiencia temporalmente.')) {
      console.log('Limpiando caché...');
      alert('Caché limpiada exitosamente');
    }
  }

  deleteAccount(): void {
    if (confirm('⚠️ ADVERTENCIA: Esta acción es irreversible. ¿Estás completamente seguro de que deseas eliminar tu cuenta?')) {
      console.log('Eliminando cuenta...');
      alert('Proceso de eliminación iniciado. Recibirás un correo de confirmación.');
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal.set(false);
  }
}
