import { AfterContentInit, AfterRenderRef, AfterViewChecked, AfterViewInit, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { QuestionService } from '../../services/question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
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
import { WebSocketService } from '../../services/web-socket.service';
import { DateTime } from 'luxon';

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
export class QuestionPageComponent implements OnInit, OnDestroy {
  Role=Role;
  destroy$ = new Subject<void>(); 
  
  answerService = inject(AnswerService)
  questionService = inject(QuestionService)
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  scrolled = false

  textForm: FormGroup = this.fb.group({
    text: ['', [Validators.required]],
  })

  questionId!: UUID;
  answerId?: UUID;
  answers: Answer[] = []
  question!: Question

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.answerId=params['answerId']
      })
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.questionId = params['questionId']
        this.questionService.getQuestionById(this.questionId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((question) =>
            this.question = question
          )
        this.answerService.getAnswersByQuestionId(this.questionId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((answers) => {
            this.answers = answers
            const element = document.getElementById(`answer-${this.answerId}`);
            console.log('ПРОКРУТКА', element, `answer-${this.answerId}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              element.classList.add('highlight'); // Добавляем класс подсветки
              setTimeout(() => {
                element.classList.remove('highlight'); // Убираем класс через 2 секунды
              }, 2000);
            }
          })
      })
      
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {  
    if (this.textForm.valid) {
      const answer = {
        text: this.textForm.value.text,
        questionId: this.question.id
      };
      console.log('Текст для отправки:', answer);
      this.answerService.sendAnswer(answer).subscribe(
        (answer) => {
          this.answers.unshift({...answer, username: this.authService.username});
          this.textForm.reset();
        }
      )    
    }
  }

  receiveDeletedAnswerId(deletedAnswerId: string | UUID) {
    console.log("deletedAnswerId" + deletedAnswerId);
    this.answers = this.answers.filter(a => a.id != deletedAnswerId)
  }
}
