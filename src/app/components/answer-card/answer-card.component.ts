import { Component, inject, Input, signal, effect } from '@angular/core';
import { Answer } from '../../interfaces/answer.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { AnswerService } from '../../services/answer.service';

@Component({
  selector: 'app-answer-card',
  imports: [
    CommonModule
  ],
  templateUrl: './answer-card.component.html',
  styleUrls: ['./answer-card.component.css']
})
export class AnswerCardComponent {
  @Input() answer!: Answer;
  authService = inject(AuthService);
  answerService = inject(AnswerService);

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
      this.answer.text = input;
      this.answerService.updateAnswer(this.answer.id, this.answer).subscribe()
    } 
  }

  toggleEdit(): void {
    this.isEditMode.set(true);
  }

  deleteAnswer() {
    this.answerService.deleteAnswer(this.answer.id).subscribe(
      () => window.location.reload()
    )
  }
}
