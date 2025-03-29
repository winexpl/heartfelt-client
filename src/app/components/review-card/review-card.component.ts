import { Component, effect, inject, Input, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Answer } from '../../interfaces/answer.interface';
import { AnswerService } from '../../services/answer.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../interfaces/review.interface';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-review-card',
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatIcon
  ],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent {
  @Input() review!: Review;
  authService = inject(AuthService);
  reviewService = inject(ReviewService);

  // Используем signal вместо обычной переменной
  isEditMode = signal(false);

  constructor() {
    // Реактивный эффект, который можно использовать для отладки
    effect(() => {
      console.log('isEditMode изменился:', this.isEditMode());
    });
  }

  onEnter(event: Event): void { 
    const input = (event.target as HTMLInputElement).value; 
    this.isEditMode.set(false);
    if(input.length > 0) { 
      this.review.text = input;
      this.reviewService.updateReview(this.review.id, this.review).subscribe()
    } 
  }

  toggleEdit(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  deleteReview() {
    this.reviewService.deleteReview(this.review.id).subscribe(
      () => window.location.reload()
    )
  }
}
