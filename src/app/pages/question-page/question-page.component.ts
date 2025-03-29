import { Component, inject, Input } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Answer } from '../../interfaces/answer.interface';
import { AnswerService } from '../../services/answer.service';
import { UserService } from '../../services/user.service';
import { Role } from '../../interfaces/user.interface';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UUID } from 'node:crypto';
import { AnswerCardComponent } from "../../components/answer-card/answer-card.component";
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { QuestionCardComponent } from "../../components/question-card/question-card.component";

@Component({
  selector: 'app-question-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AnswerCardComponent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButtonModule,
    QuestionCardComponent
],
  templateUrl: './question-page.component.html',
  styleUrl: './question-page.component.css'
})
export class QuestionPageComponent {
  Role=Role;
  answerService = inject(AnswerService)
  questionService = inject(QuestionService)
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  authService = inject(AuthService)
  fb = inject(FormBuilder)

  textForm: FormGroup = this.fb.group({
    text: ['', [Validators.required]],
  })

  questionId!: UUID;
  @Input() answerId?: UUID;

  constructor() { 
    if(this.answerId) {
      console.log('input', this.answerId);
    }
   }
  
  answers$: Observable<Answer[]> = this.activatedRoute.params.pipe(
    switchMap(({ questionId }) => {
      return this.answerService.getAnswersByQuestionId(questionId)
    })
  )

  question$: Observable<Question> = this.activatedRoute.params.pipe(
    switchMap(({ questionId }) => {
      this.questionId = questionId;
      return this.questionService.getQuestionById(questionId)
    })
  );

  onSubmit() {
    if (this.textForm.valid) {
      const answer = this.textForm.value;
      const newAnswer = {...answer, questionId: this.questionId};
      console.log('Текст для отправки:', newAnswer);
      this.answerService.sendAnswer(newAnswer).subscribe(
        () => window.location.reload());      
    }
  }
}
