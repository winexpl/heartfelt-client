import { Component, inject, Input } from '@angular/core';
import { QuestionService } from '../../services/question.service';
import { CommonModule } from '@angular/common';
import { QuestionCardComponent } from "../../components/question-card/question-card.component";
import { Router } from '@angular/router';
import { Answer } from '../../interfaces/answer.interface';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../interfaces/user.interface';

@Component({
  selector: 'app-questions-page',
  imports: [CommonModule, QuestionCardComponent],
  templateUrl: './questions-page.component.html',
  styleUrl: './questions-page.component.css'
})

export class QuestionsPageComponent {
  Role=Role
  questionService = inject(QuestionService)
  router = inject(Router)
  questions$ = this.questionService.getAllQuestions()
  authService = inject(AuthService)

  navigateToCreateQuestion() {
    this.router.navigateByUrl('/questions/new')
  }

  onEnter(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    console.log(input)
    this.questions$=this.questionService.findByTitle(input)
  }
}
