import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    ProfileCardComponent,
    MatInput,
    MatLabel,
    MatIcon,
    MatFormField
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  userService = inject(UserService)
  users$ = this.userService.getAllUsers()
  isDropdownOpen = false;

  onEnter(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    console.log(input)
    this.users$ = this.userService.getAllUsersByUsername(input)
  }
}