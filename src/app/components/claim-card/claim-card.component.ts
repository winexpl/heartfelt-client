import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Claim, ClaimType } from '../../interfaces/claim.interface';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { ClaimService } from '../../services/claim.service';
import { AnswerService } from '../../services/answer.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Role } from '../../interfaces/user.interface';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-claim-card',
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatCardHeader,
    MatButton
  ],
  templateUrl: './claim-card.component.html',
  styleUrl: './claim-card.component.css'
})
export class ClaimCardComponent {
  ClaimType=ClaimType
  answerService = inject(AnswerService)
  claimService = inject(ClaimService)
  userService = inject(UserService)
  questionService = inject(QuestionService)
  router = inject(Router)
  @Input() claim!: Claim

  @Output() deleted = new EventEmitter<Claim>;

  navigateString() {
    switch(this.claim.claimType) {
      case ClaimType.ANSWER: return 'Перейти к ответу'
      case ClaimType.QUESTION: return 'Перейти к вопросу'
      default: return 'Неизвестный тип'
    }
  }

  navigateHref() {
    console.log(this.claim, this.claim.questionId, this.claim.id);
    
    switch(this.claim.claimType) {
      case ClaimType.QUESTION: {
        this.router.navigateByUrl(`questions/${this.claim.questionId}`);
        break
      }
      case ClaimType.ANSWER: 
      {
        this.answerService.getAnswerById(this.claim.answerId).subscribe(
          (answer) => {
            this.router.navigate([`questions/${answer.questionId}`], 
              { queryParams: { answerId: answer.id } });
          }
        );
        break
      }
    }
  }

  navigateToReceiver() {
    this.router.navigateByUrl(`${this.claim.receiverUsername}`);
  }

  navigateToSender() {
    this.router.navigateByUrl(`${this.claim.senderUsername}`);
  }

  deleteClaim() {
    this.deleted.emit(this.claim);
  }

  deleteAnswer() {
    this.answerService.deleteAnswer(this.claim.answerId).subscribe()
    this.deleteClaim()
  }

  updateRoleAndDeleteAnswer() {
    this.userService.updateRole(this.claim.receiverId, Role.SUFFERY).subscribe({
      next: () => this.deleteClaim()
    })
  }
  
  deleteQuestion() {
    this.questionService.deleteQuestion(this.claim.questionId).subscribe({
      next: () => this.deleteClaim()
    })
    
  }
}
