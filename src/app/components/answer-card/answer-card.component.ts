import { Component, inject, Input, signal, effect, Output, EventEmitter } from '@angular/core';
import { Answer } from '../../interfaces/answer.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { AnswerService } from '../../services/answer.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditClaimModalComponent } from '../edit-claim-modal/edit-claim-modal.component';
import { ClaimType } from '../../interfaces/claim.interface';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-answer-card',
  imports: [
    CommonModule,
    MatFormField,
    MatIcon,
    MatLabel,
    MatInput
  ],
  templateUrl: './answer-card.component.html',
  styleUrls: ['./answer-card.component.css']
})
export class AnswerCardComponent {
  @Input() answer!: Answer;
  authService = inject(AuthService);
  answerService = inject(AnswerService);
  dialog = inject(MatDialog)
  webSocetService = inject(WebSocketService)

  @Output() deletedAnswerId = new EventEmitter<string>();

  isEditMode = signal(false);

  constructor() {
    effect(() => {
      console.log('isEditMode изменился:', this.isEditMode());
    });
  }

  onEnter(event: Event): void { 
    const input = (event.target as HTMLInputElement).value; 
    this.isEditMode.set(false);
    if(input.length > 0) { 
      
      this.answerService.updateAnswer(this.answer.id, this.answer).subscribe({
        next: (answer) => {
          this.answer.text = input;
        }
      })
    } 
  }

  toggleEdit(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  deleteAnswer() {
    this.answerService.deleteAnswer(this.answer.id).subscribe(
      () => this.deletedAnswerId.emit(this.answer.id)
    )
  }

  openModal(): void {
    this.dialog.open(EditClaimModalComponent, {
      width: '600px',
      data: { answerId: this.answer.id, 
        claimType: ClaimType.ANSWER, 
        receiverId: this.answer.psychologistId },
    });
  }  
}
