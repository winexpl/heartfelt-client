import { Component, Inject, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { UUID } from 'node:crypto';
import { ClaimType } from '../../interfaces/claim.interface';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ClaimService } from '../../services/claim.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardActions, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-edit-claim-page',
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogActions,
    MatDialogTitle,
  ],
  templateUrl: './edit-claim-modal.component.html',
  styleUrl: './edit-claim-modal.component.css'
})
export class EditClaimModalComponent {
  dialogRef = inject(MatDialogRef<EditClaimModalComponent>)
  claimService = inject(ClaimService)

  fb = inject(FormBuilder)
  form = this.fb.group({
    text: ['', Validators.required]
  })
  public data: { answerId: UUID | string, 
    claimType: ClaimType, 
    receiverId: UUID | string,
    questionId: UUID | string } = inject(MAT_DIALOG_DATA)
  constructor() {}
  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    const newClaim = {
      text: this.form.value.text,
      receiverId: this.data.receiverId,
      answerId: this.data.answerId,
      questionId: this.data.questionId,

      claimType: this.data.claimType
    }
    this.claimService.saveClaim(newClaim).subscribe()
    this.close()
  }
}
