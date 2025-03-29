import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Role, User } from '../../interfaces/user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
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
export class ProfilePageComponent {
  Role=Role
  userService = inject(UserService)
  activatedRoute = inject(ActivatedRoute)
  questionService = inject(QuestionService)
  reviewService = inject(ReviewService)
  router = inject(Router)
  authService = inject(AuthService)
  fb = inject(FormBuilder)

  form: FormGroup = this.fb.group({
    review: ['', [Validators.required]],
  })
    
  username = this.activatedRoute.snapshot.paramMap.get('username')
  userId = this.activatedRoute.snapshot.paramMap.get('userId')

  user$: Observable<User> = (this.username? 
    this.userService.getUserByUsername(this.username) :
    this.userService.getUserById(this.userId!)).pipe(
      tap((user) => {
        this.userId = user.id;
        this.username = user.username;
      }
    )
  )

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

  onSubmit() {
    const newReview = {
      text: this.form.value.review,
      receiverId: this.userId!,
      senderId: this.authService.id,
      id: undefined,
      senderUsername: undefined,
      createdAt: undefined
    }
    this.reviewService.saveReview(newReview).subscribe(
      () => window.location.reload()
    )
  }
}
