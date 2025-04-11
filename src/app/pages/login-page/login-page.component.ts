import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  showPassword = signal<boolean>(false);
  authService = inject(AuthService)
  router = inject(Router)

  form: FormGroup = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  })

  onSubmit(event: Event) {
    console.log(event);
    console.log(this.form.value);
    if(this.form.valid) {
      this.authService.login(this.form.value)
        .subscribe(res => {
          this.router.navigate(['questions'])
        })
    }
  }
}
