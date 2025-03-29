import { Routes } from '@angular/router';
import { QuestionsPageComponent } from './pages/questions-page/questions-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { canActivateAuth } from './auth/access.guard';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { canActivateRole } from './auth/role.guard';
import { QuestionPageComponent } from './pages/question-page/question-page.component';
import { EditQuestionComponent } from './pages/edit-question-page/edit-question-page.component';
import { ClaimsPageComponent } from './pages/claims-page/claims-page.component';
import { Role } from './interfaces/user.interface';
import { EditProfileModalComponent } from './components/edit-profile-modal/edit-profile-modal.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterPageComponent },
    {
        path: '', 
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'questions', pathMatch: 'full' },
            { path: 'questions', component: QuestionsPageComponent}, 
            { path: 'questions/new', component: EditQuestionComponent },
            { path: 'search', component: UsersPageComponent },
            { path: 'settings', component: SettingsPageComponent }, 
            { path: 'edit', component: EditProfileModalComponent },
            { path: 'claims', component: ClaimsPageComponent, 
                canActivate: [canActivateRole], data: {'role': Role.ADMIN}},
            { path: 'id:userId', component: ProfilePageComponent },
            { path: ':username', component: ProfilePageComponent },
            { path: 'questions/:questionId', component: QuestionPageComponent },
            { path: 'questions/edit/:questionId', component: EditQuestionComponent }

        ],
        canActivate: [canActivateAuth]
    }
];