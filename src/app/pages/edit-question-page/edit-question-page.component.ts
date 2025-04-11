import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../interfaces/question.interface';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { UUID } from 'crypto';
import { EditClaimModalComponent } from '../../components/edit-claim-modal/edit-claim-modal.component';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-edit-question',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatCheckbox,
    MatButton,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent
  ],
  templateUrl: './edit-question-page.component.html',
  styleUrl: './edit-question-page.component.css'
})
export class EditQuestionComponent {
  authService = inject(AuthService)
  userService = inject(UserService)
  router = inject(Router)
  fb = inject(FormBuilder)
  dialogRef = inject(MatDialogRef<EditClaimModalComponent>)
  
  public data: { question: Question } = inject(MAT_DIALOG_DATA)
  question: Question = this.data.question;

  questionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    text: ['', Validators.required],
    anonymous: [false]
  }); 

  constructor() {
    if(this.question) this.initializeForm();
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const newQuestion: Question = {
        id: '',
        userId: this.authService.id,
        username: this.authService.username,
        nickname: '',
        title: '',
        text: '',
        createdAt: new Date() as unknown as DateTime,
        anonymous: false
      }
      this.dialogRef.close({...newQuestion, ...this.questionForm.value});
    }
  }

  handleTab(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // Предотвращаем переход фокуса
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '\t' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }
  }

  private initializeForm(): void {
    this.questionForm.setValue({
      title: this.question?.title,
      text: this.question?.text,
      anonymous: this.question?.anonymous
    })
  }

  isAnonymous() {
    if(this.question) return this.question?.anonymous
    return false;
  }
}
