import { Component, inject } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { CommonModule } from '@angular/common';
import { ClaimCardComponent } from '../../components/claim-card/claim-card.component';

@Component({
  selector: 'app-claims-page',
  imports: [
    CommonModule,
    ClaimCardComponent
  ],
  templateUrl: './claims-page.component.html',
  styleUrl: './claims-page.component.css'
})
export class ClaimsPageComponent {
  claimService = inject(ClaimService)

  claims$ = this.claimService.getAllClaims()
}
