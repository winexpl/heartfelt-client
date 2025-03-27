import { Component, Input } from '@angular/core';
import { Claim, ClaimType } from '../../interfaces/claim.interface';

@Component({
  selector: 'app-claim-card',
  imports: [],
  templateUrl: './claim-card.component.html',
  styleUrl: './claim-card.component.css'
})
export class ClaimCardComponent {
  ClaimType=ClaimType
  @Input() claim!: Claim

  navigateString() {
    switch(this.claim.claimType) {
      case ClaimType.ANSWER: return 'Перейти к ответу'
      case ClaimType.QUESTION: return 'Перейти к вопросу'
      default: return 'Неизвестный тип'
    }
  }

  navigateHref() {
    switch(this.claim.claimType) {
      case ClaimType.ANSWER: return `questions/${this.claim.refId}`;
      case ClaimType.QUESTION: return `questions/${this.claim.refId}`;
      default: return `not-found`;
    }
  }
}
