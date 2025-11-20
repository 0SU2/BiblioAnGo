import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-dashboard',
  standalone: true,         // Muy importante
  imports: [
    Header,
    Sidebar,
    Footer
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
