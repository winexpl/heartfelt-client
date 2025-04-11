import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Request } from '../../interfaces/request.interface';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { Role } from '../../interfaces/user.interface';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-card',
  imports: [
    MatCardContent,
    MatCard,
    MatCardActions,
    MatButton
  ],
  templateUrl: './request-card.component.html',
  styleUrl: './request-card.component.css'
})
export class RequestCardComponent {
  userService = inject(UserService)
  requestService = inject(RequestService)

  @Input() request!: Request
  @Output() deleted = new EventEmitter<Request>;

  deleteRequest() {
    this.deleted.emit(this.request);
  }

  updateRole() {
    this.userService.updateRole(this.request.userId, Role.PSYCHOLOG).subscribe() 
    this.deleteRequest() 
  }
}
