import { Component, inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Role, User } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../interfaces/question.interface';
import { QuestionCardComponent } from '../../components/question-card/question-card.component';
import { AuthService } from '../../auth/auth.service';
import { Review } from '../../interfaces/review.interface';
import { ReviewService } from '../../services/review.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ReviewCardComponent } from "../../components/review-card/review-card.component";
import { WebSocketService } from '../../services/web-socket.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    QuestionCardComponent,
    MatCardModule,
    MatListModule,
    MatLabel,
    MatInput,
    MatFormField,
    ReactiveFormsModule,
    ReviewCardComponent
],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  Role=Role
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  questionService = inject(QuestionService)
  reviewService = inject(ReviewService)
  router = inject(Router)
  authService = inject(AuthService)
  fb = inject(FormBuilder)
  destroy$ = new Subject<void>(); 
  webSocketService = inject(WebSocketService)
  

  form: FormGroup = this.fb.group({
    review: ['', [Validators.required]],
  })
    
  username = this.activatedRoute.snapshot.paramMap.get('username')
  userId = this.activatedRoute.snapshot.paramMap.get('userId')

  user!: User;
  questions: Question[] = [];
  reviews: Review[] = [];
  
  ngOnInit(): void {
    (this.username? 
    this.userService.getUserByUsername(this.username) :
    this.userService.getUserById(this.userId!))
    .pipe(takeUntil(this.destroy$),
    tap((profile) => console.log('Пользователь загружен:', profile)))
    .subscribe(
      (user) => {
        this.userId = user.id;
        this.username = user.username;
        this.user = user;

        if(user.role.includes(Role.SUFFERY)) {
          this.questionService.getQuestionsByUserId(user.id)
          .pipe(
            takeUntil(this.destroy$),
            tap((questions) => console.log('Вопросы загружены:', questions)))
          .subscribe((questions) => {
            this.questions = questions
        })
        } else if(user.role.includes(Role.PSYCHOLOG)) {
          this.reviewService.getAllReviewsByReceiverId(user.id)
            .pipe(
              takeUntil(this.destroy$),
              tap((questions) => console.log('Отзывы загружены:', questions)))
            .subscribe((reviews) =>
              this.reviews = reviews
            )
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  editMode: boolean = false;

  onEditMode() {
    this.editMode = !this.editMode;
  }

  createReview() {
    const newReview: Review = {
      id: '',
      text: this.form.value.review,
      receiverId: this.user.id,
      senderId: this.authService.id,
      senderUsername: this.authService.username,
      receiverUsername: this.user.username,
      createdAt: new Date() as unknown as DateTime
    }
    this.reviewService.saveReview(newReview).subscribe({
      next: (review) => {
        this.reviews.unshift({...review, senderUsername: this.authService.username});
      }
    })
  }

  receiveDeletedReview(review: Review) {
    this.reviewService.deleteReview(review.id).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id != review.id)
      }
    })
  }

  receiveUpdatedQuestion(question: Question) {
    console.log(question);
    
    this.questionService.updateQuestionById(question.id, question).subscribe(
      {
        next: (response) => {
          const index = this.questions.findIndex(q => q.id === question.id);
          console.log(index);
          
          if(index >= 0) {
            this.questions[index] = question;
          }
        },
        error: (error) => {
          console.error('Ошибка при сохранении вопроса:', error);
        }
      }
    )

  }

  receiveDeletedQuestion(question: Question) {
    this.questionService.deleteQuestion(question.id).subscribe({
      next: () => {
        this.questions = this.questions.filter(q => q.id != question.id);
      },
      error: (error) => {
        console.error('Ошибка при удалении вопроса:', error);
      }
    })
  }
}
