import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../interfaces/question.interface';

@Component({
  selector: 'app-edit-question',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-question-page.component.html',
  styleUrl: './edit-question-page.component.css'
})
export class EditQuestionComponent {
  authService = inject(AuthService)
  userService = inject(UserService)
  questionService = inject(QuestionService)
  router = inject(Router)
  fb = inject(FormBuilder)
  activatedRoute = inject(ActivatedRoute)
  
  question? : Question; 

  questionForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    text: [''],
    anonymous: [false]
  }); 


  constructor() {
    const questionId = this.activatedRoute.snapshot.paramMap.get('questionId')
    if(questionId) {
      this.questionService.getQuestionById(questionId).subscribe({
        next: (response) => {
          this.question = response;
          this.initializeForm();
        },
        error: (error) => {
          console.error('Ошибка загрузки вопроса:', error);
          this.router.navigateByUrl('/questions')
        }
      })
    }
  }

  onSubmit(): void {
    const newQuestion = this.questionForm.value;
    if (this.questionForm.valid) {
      if(this.question) {
        this.questionService.updateQuestionById(this.question.id, newQuestion).subscribe()
      } else {
        console.log('Новый вопрос:', newQuestion);
        this.questionService.saveQuestion(newQuestion).subscribe()
      }
      this.router.navigateByUrl('/questions')
    }
  }

  onCancel(): void {
    console.log('Отмена редактирования');
    this.router.navigateByUrl('/questions')

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
