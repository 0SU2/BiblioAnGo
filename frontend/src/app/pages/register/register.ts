import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

  constructor(private router: Router, private auth: Auth) {}

  async register() {
    const ok = await this.auth.register(this.form);
    if (ok) {
      this.router.navigate(['/dashboard']);
    }
  }
}
