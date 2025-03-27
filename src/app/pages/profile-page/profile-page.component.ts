import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Role, User } from '../../interfaces/user.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../interfaces/question.interface';
import { v4 as uuidv4 } from 'uuid';
import { QuestionCardComponent } from '../../components/question-card/question-card.component';
import { AuthService } from '../../auth/auth.service';
import { Review } from '../../interfaces/review.interface';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    FormsModule,
    CommonModule,
    QuestionCardComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  Role=Role
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  questionService = inject(QuestionService)
  reviewService = inject(ReviewService)
  router = inject(Router)
  authService = inject(AuthService)

  username = this.activatedRoute.snapshot.paramMap.get('username')
  userId = this.activatedRoute.snapshot.paramMap.get('userId')

  user$: Observable<User> = (this.username? 
    this.userService.getUserByUsername(this.username) :
    this.userService.getUserById(this.userId!))

  questions$: Observable<Question[]> = this.user$.pipe(
    tap((user) => console.log('Пользователь загружен:', user)),
    switchMap((user) => 
      this.questionService.getQuestionsByUserId(user.id!).pipe(
        tap((questions) => console.log('Вопросы загружены:', questions))
      )
    )
  );

  reviews$: Observable<Review[]> = this.user$.pipe(
    tap((user) => console.log('Пользователь загружен:', user)),
    switchMap((user) => 
      this.reviewService.getAllReviewsByReceiverId(user.id!).pipe(
        tap((questions) => console.log('Вопросы загружены:', questions))
      )
    )
  );

  editMode: boolean = false;

  onEditMode() {
    this.editMode = !this.editMode;
  }

  editProfile(): void {

  }
}
