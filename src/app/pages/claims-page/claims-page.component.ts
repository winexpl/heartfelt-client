import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { CommonModule } from '@angular/common';
import { ClaimCardComponent } from '../../components/claim-card/claim-card.component';
import { Claim } from '../../interfaces/claim.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-claims-page',
  imports: [
    CommonModule,
    ClaimCardComponent
  ],
  templateUrl: './claims-page.component.html',
  styleUrl: './claims-page.component.css'
})
export class ClaimsPageComponent implements OnInit, OnDestroy {
  claimService = inject(ClaimService)
  private destroy$ = new Subject<void>(); 

  claims: Claim[] = []

  ngOnInit() {
    this.claimService.getAllClaims()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (claims) => {
          this.claims = claims
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  receiveDeletedClaim(claim: Claim) {
    this.claimService.deleteClaim(claim.id).subscribe({
      next: () => {
        this.claims = this.claims.filter(c => c.id != claim.id)
      }
    })
  }
}
