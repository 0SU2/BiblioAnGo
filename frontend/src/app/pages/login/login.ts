import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  usuario: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    console.log('Usuario:', this.usuario);
    console.log('Contraseña:', this.password);

    // Aquí luego llamas a AuthService
    // this.auth.login(this.usuario, this.password)

    this.router.navigate(['/dashboard']);
  }
}
