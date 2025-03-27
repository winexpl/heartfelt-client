import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../interfaces/user.interface';
import { EditPasswordModalComponent } from "../../components/edit-password-modal/edit-password-modal.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-page',
  imports: [
    EditPasswordModalComponent,
    CommonModule
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  Role=Role;
  authService = inject(AuthService)
  router = inject(Router)
  isOpenFormForEditPassword: boolean = false;

  @ViewChild(EditPasswordModalComponent) modalForm!: EditPasswordModalComponent; // доступ к компоненту  
  
  logout() {
    this.authService.logout()
  }

  navigateToEditProfile() {
    this.router.navigateByUrl('edit')
  }

  navigateToEditPassword() {
    this.isOpenFormForEditPassword = !this.isOpenFormForEditPassword;
  }
}
