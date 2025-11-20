import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './header.html',
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  logoPath: string = 'assets/libabu-logo.png';

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
