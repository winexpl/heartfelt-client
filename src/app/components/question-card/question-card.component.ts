import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Question } from '../../interfaces/question.interface';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { QuestionService } from '../../services/question.service';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EditClaimModalComponent } from '../edit-claim-modal/edit-claim-modal.component';
import { ClaimType } from '../../interfaces/claim.interface';
import { EditQuestionComponent } from '../../pages/edit-question-page/edit-question-page.component';
import { WebSocketService } from '../../services/web-socket.service';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-question-card',
  imports: [
    CommonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css'
})
export class QuestionCardComponent {
  router = inject(Router)
  @Input() question!: Question;
  @Output() deleted = new EventEmitter<Question>()
  @Output() updated = new EventEmitter<Question>()


  authService = inject(AuthService)
  questionService = inject(QuestionService)
  dialog = inject(MatDialog)
  webSocketService = inject(WebSocketService)


  sendDeleted(): void {
    this.deleted.emit(this.question);
  }

  redirectToQuestion() {
    this.router.navigate([`questions/${this.question.id}`])
  }

  
  deleteQuestion() {
    this.sendDeleted();
  }

  editQuestion() {
    const dialogRef = this.dialog.open(EditQuestionComponent, {
      width: '800px',
      data: { question: this.question },
    });

    dialogRef.afterClosed().subscribe((question: Question) => {
      if (question) {
        this.updated.emit({ ...this.question, ...question});
      } else {
        console.log('Диалог закрыт без возврата значения');
      }
    });
  }

  // navigate() {
  //   this.router.navigateByUrl(`questions`);
  // }

  openModal(): void {
    this.dialog.open(EditClaimModalComponent, {
      width: '600px',
      data: { questionId: this.question.id, 
        claimType: ClaimType.QUESTION, 
        receiverId: this.question.userId },
    });
  }
} 
