import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile-page',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.css'
})
export class EditProfilePageComponent {
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
