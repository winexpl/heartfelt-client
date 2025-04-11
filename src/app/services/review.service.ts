import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../interfaces/review.interface';
import { environment } from '../../environments/environment';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl
  constructor() { }

  getAllReviewsByReceiverId(receiverId: UUID | string) {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`,
      {params: {
        receiverId: receiverId
      }
    })
  }

  saveReview(review: any) {
    return this.http.post<Review>(`${this.apiUrl}/reviews`,
      review
    )
  }

  updateReview(id: UUID | string, review: Review) {
    return this.http.put<Review>(`${this.apiUrl}/reviews/${id}`,
      review
    )
  }

  deleteReview(id: UUID | string) {
    return this.http.delete(`${this.apiUrl}/reviews/${id}`)
  }

}
