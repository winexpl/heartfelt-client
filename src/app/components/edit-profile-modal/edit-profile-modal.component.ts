import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-edit-profile-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css'
})
export class EditProfileModalComponent {
  authService = inject(AuthService)
  userService = inject(UserService)
  router = inject(Router)
  fb = inject(FormBuilder)
  user!: User
  profileForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    nickname: [''],
    about: ['', [Validators.maxLength(500)]],
  }); 


  constructor() {
    this.userService.getUserById(this.authService.id).subscribe({
      next: (response) => {
        this.user = response;
        this.initializeForm();
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователя:', error);
        this.router.navigateByUrl('/login')
      }
    })
  }

  private initializeForm(): void {
    this.profileForm.setValue({
      username: this.user.username,
      nickname: this.user.nickname,
      about: this.user.about
    })
  }

  onSubmit(): void {
    const updatedProfile = this.profileForm.value;
    if (this.profileForm.valid) {
      this.userService.updateUser(this.user.id, updatedProfile).subscribe()
      console.log('Обновлённые данные профиля:', updatedProfile);
    }
  }

  onCancel(): void {
    console.log('Отмена редактирования');
    this.profileForm.reset();
    this.initializeForm()
  }
}
