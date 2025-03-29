import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../interfaces/user.interface';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  Role=Role;
  authService = inject(AuthService)

  constructor() {
    console.log('constr', this.authService.roles.includes(Role.ADMIN));   
  }
}
