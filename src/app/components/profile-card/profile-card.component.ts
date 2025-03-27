import { Component, inject, Input } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-card',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {
  @Input() user!: User;

  userService = inject(UserService)
  router = inject(Router)

  redirectToProfile() {    
    this.router.navigate([`${this.user.username}`])
  }
}
