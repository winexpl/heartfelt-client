import { Component, inject, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../auth/auth.service';

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
  showOldPassword = false;
  showNewPassword = false;
  showNewRepeatPassword = false;
  authService = inject(AuthService)

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordRepeat: ['', Validators.required]
    });
  }

  toggleShowOldPassword(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowNewRepeatPassword(): void {
    this.showNewRepeatPassword = !this.showNewRepeatPassword;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Форма отправлена', this.form.value);
      this.authService.editPassword(this.form.value).subscribe();
    } else {
      console.error('Форма невалидна');
    }
  }

}

