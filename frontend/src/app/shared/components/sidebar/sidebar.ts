import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router'; // Necesario para la navegación en Angular

// Define la estructura de cada elemento del menú
interface NavItem {
  icon: string; // Nombre del ícono (se usará como texto o en librerías de íconos)
  label: string;
  route: string;
  isSpecial?: boolean; // Para diferenciar la sección superior/activa
}

@Component({
  selector: 'app-sidebar', // Selector usado en el HTML
  standalone: true,
  // Importa módulos de Angular necesarios para bucles (*ngFor) y enrutamiento
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.html',
})
export class Sidebar { // Renombrado a Sidebar

  // Lista de ítems de navegación basados en tu Figma
  navItems = [
    { icon: 'home', label: 'Inicio', route: '/dashboard' },
    { icon: 'explore', label: 'Explorar', route: '/explore' },
    { icon: 'community', label: 'Comunidad', route: '/community' },
    { icon: 'stories', label: 'Tus historias', route: '/stories' },
    { icon: 'favorites', label: 'Favoritos', route: '/favorites' }
  ];

  configItems = [
    { icon: 'settings', label: 'Configuración', route: '/settings' },
    { icon: 'help', label: 'Ayuda', route: '/help' }
  ];


  // Nota: Para los íconos (home, explore, settings, etc.),
  // usaremos los nombres de Google Material Icons ya que se asemejan al diseño.
}
