import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-password-modal',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-password-modal.component.html',
  styleUrl: './edit-password-modal.component.css'
})
export class EditPasswordModalComponent {
  form!: FormGroup;
  fb: FormBuilder = inject(FormBuilder)
  showOldPassword = false;
  showNewPassword = false;
  showConfirmNewPassword = false;
  authService = inject(AuthService)
  snackBar = inject(MatSnackBar)
  minPasswordLength = 5

  constructor() {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(this.minPasswordLength)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmNewPassword');
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


  toggleShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowNewRepeatPassword(): void {
    this.showConfirmNewPassword = !this.showConfirmNewPassword;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Форма отправлена', this.form.value);
      this.authService.editPassword(this.form.value).subscribe({
        next: (r: string) => {
          this.snackBar.open('Пароль успешно изменен', 'Закрыть', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          if(error.status == 401) {
            this.snackBar.open('Старый пароль неверен', 'Закрыть', {
              duration: 3000,
              panelClass: ['warning-snackbar']
            });
          }
        }
      });
    } else {
      console.error('Форма невалидна');
    }
  }

}

