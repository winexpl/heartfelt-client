import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  imports: [ReactiveFormsModule]
})
export class RegisterPageComponent {
  authService = inject(AuthService)
  router = inject(Router)
  form: FormGroup = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, Validators.required)
  })
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(event: Event): void {
    console.log('submit');
    if (this.form.valid) {
      if(this.form.value.password === this.form.value.confirmPassword) {
        this.authService.register(this.form.value).subscribe({
          next: (response) => {
            console.log(response)
            this.router.navigateByUrl("/login")
          },
          error: (error) => {
            console.error('Ошибка при регистрации:', error);
          }
        });
        console.log('Форма успешно отправлена', this.form.value);
      }
      else {
        console.error('Пароли не совпадают');
      }
    } 
  }
}
