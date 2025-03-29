import { Component, inject, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../interfaces/user.interface';
import { EditPasswordModalComponent } from "../../components/edit-password-modal/edit-password-modal.component";
import { CommonModule } from '@angular/common';
import { EditProfileModalComponent } from '../../components/edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-settings-page',
  imports: [
    EditPasswordModalComponent,
    CommonModule,
    EditProfileModalComponent
],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent {
  Role=Role;
  authService = inject(AuthService)
  router = inject(Router)
  isOpenFormForEditPassword: boolean = false;
  isOpenFormForEditProfile: boolean = false;

  @ViewChild(EditPasswordModalComponent) modalPasswordForm!: EditPasswordModalComponent; // доступ к компоненту  
  @ViewChild(EditProfileModalComponent) modalProfileForm!: EditProfileModalComponent; // доступ к компоненту  

  
  logout() {
    this.authService.logout()
  }

  navigateToEditProfile() {
    if(this.isOpenFormForEditPassword) this.isOpenFormForEditPassword=false
    this.isOpenFormForEditProfile = !this.isOpenFormForEditProfile;
  }

  navigateToEditPassword() {
    if(this.isOpenFormForEditProfile) this.isOpenFormForEditProfile=false
    this.isOpenFormForEditPassword = !this.isOpenFormForEditPassword;
  }
}
