import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { RequestCardComponent } from "../../components/request-card/request-card.component";
import { Request } from '../../interfaces/request.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-requests-page',
  imports: [
    CommonModule,
    RequestCardComponent
],
  templateUrl: './requests-page.component.html',
  styleUrl: './requests-page.component.css'
})
export class RequestsPageComponent implements OnInit, OnDestroy{
  
  requestService = inject(RequestService)
  private destroy$ = new Subject<void>(); 
  

  requests: Request[] = [];

  ngOnInit(): void {
    this.requestService.getAllRequests()
      .pipe(takeUntil(this.destroy$))  
      .subscribe({
      next: (requests) => {
        this.requests = requests;
      }
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  receiveDeletedRequest(request: Request) {
    this.requestService.deleteRequest(request.id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.id != request.id);
      }
    })
  }
}
