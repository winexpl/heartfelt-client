import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { MatLabel, MatFormField, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  imports: [
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
    MatError
  ]
})
export class RegisterPageComponent {
  authService = inject(AuthService)
  router = inject(Router)
  form: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  minPasswordLength = 5;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  
  }
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) {
      return null;
    }
    const isMatching = password.value === confirmPassword.value;
    if (!isMatching) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword.hasError('passwordMismatch')) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
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
