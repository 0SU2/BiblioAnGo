import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
})
export class Register {
  form = {
    nombre: '',
    apPaterno: '',
    apMaterno: '',
    ciudad: '',
    pais: '',
    usuario: '',
    password: ''
  };

  constructor(private router: Router) {}

  register() {
    console.log('Datos:', this.form);

    // Aquí luego usas AuthService.register()

    this.router.navigate(['/login']);
  }
}
