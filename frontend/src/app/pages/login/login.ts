import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  usuario: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private auth: Auth
  ) {}

  async login() {
    if (!this.usuario || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const success = await this.auth.login(this.usuario, this.password);

    if (success.status) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = success.message
    }
  }
}
