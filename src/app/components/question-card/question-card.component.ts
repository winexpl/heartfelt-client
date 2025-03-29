import { Component, inject, Input } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { QuestionService } from '../../services/question.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-question-card',
  imports: [
    CommonModule,
    MatIcon
  ],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  router = inject(Router)
  @Input() question!: Question;
  authService = inject(AuthService)
  questionService = inject(QuestionService)

  redirectToQuestion() {
    this.router.navigate([`questions/${this.question?.id}`])
  }

  deleteQuestion() {
    this.questionService.deleteQuestion(this.question.id).subscribe(
      () => window.location.reload()
    )
  }

  editQuestion() {
    this.router.navigate([`questions/edit/${this.question?.id}`])
  }

  navigate() {
    this.router.navigateByUrl(`questions/${this.question.id}`);
  }
}
