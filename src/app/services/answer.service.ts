import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'crypto';
import { Answer } from '../interfaces/answer.interface';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  private apiUrl = environment.apiUrl
  private http = inject(HttpClient)

  constructor() { }

  getAnswersByQuestionId(questionId: UUID) {
    return this.http.get<Answer[]>(`${this.apiUrl}/answers`, { params: {
      questionId: questionId
    }})
  }

  sendAnswer(answer: Answer) {
    return this.http.post<Answer>(`${this.apiUrl}/answers`, answer)
  }

  getAnswersByUserId() {
    
  }

  updateAnswer(id: UUID | string, answer: Answer) {
    return this.http.put<Answer>(`${this.apiUrl}/answers/${id}`, answer)
  }

  deleteAnswer(id: UUID | string) {
    return this.http.delete(`${this.apiUrl}/answers/${id}`)
  }
}
