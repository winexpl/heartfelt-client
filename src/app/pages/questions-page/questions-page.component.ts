import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { QuestionCardComponent } from "../../components/question-card/question-card.component";
import { Router } from '@angular/router';
import { Answer } from '../../interfaces/answer.interface';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../interfaces/user.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Question } from '../../interfaces/question.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WebSocketService } from '../../services/web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { EditQuestionComponent } from '../edit-question-page/edit-question-page.component';

@Component({
  selector: 'app-questions-page',
  imports: [
    CommonModule,
    QuestionCardComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './questions-page.component.html',
  styleUrl: './questions-page.component.css'
})

export class QuestionsPageComponent implements OnInit, OnDestroy {
  Role=Role
  notification: any;
  private destroy$ = new Subject<void>(); 
  questionService = inject(QuestionService)
  router = inject(Router)
  dialog = inject(MatDialog)
  
  authService = inject(AuthService)
  questions: Question[] = []

  ngOnInit(): void {}

  constructor() {
    this.questionService.getAllQuestions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(  
        (questions) => {
          this.questions = questions
        }
      )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDeleted(deletedQuestion: Question): void {
    console.log(deletedQuestion);
    this.questionService.deleteQuestion(deletedQuestion.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe()
    this.questions = this.questions.filter(q => q !== deletedQuestion);  
  }

  navigateToCreateQuestion() {
    const dialogRef = this.dialog.open(EditQuestionComponent, {
      width: '800px',
      data: {  },
    });

    dialogRef.afterClosed().subscribe((question: Question) => {
      if (question) {
        this.questionService.saveQuestion(question)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
          {
            next: (response) => {
              this.questions.unshift(question);
            },
            error: (error) => {
              console.error('Ошибка при сохранении вопроса:', error);
            }
          }
        )
        console.log('Полученное значение:', question);
      } else {
        console.log('Диалог закрыт без возврата значения');
      }
    });
  }

  onEnter(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    console.log(input)
    this.questionService.findByTitle(input)
      .pipe(takeUntil(this.destroy$))  
      .subscribe(
        (questions) => {
          this.questions = questions
        }
      )
  }
}
