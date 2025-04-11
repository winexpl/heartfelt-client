import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Question } from '../interfaces/question.interface';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = environment.apiUrl
  private http = inject(HttpClient)

  constructor() { }

  getAllQuestions() {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`)
  }

  getQuestionById(id: UUID | string) {
    return this.http.get<Question>(`${this.apiUrl}/questions/${id}`)
  }

  getQuestionsByUserId(userId: UUID | string) {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`, {
      params: {
        userId: userId
      }
    })
  }

  saveQuestion(question: Question) {
    return this.http.post<Question>(`${this.apiUrl}/questions`, question)
  }

  deleteQuestion(id: UUID | string) {
    return this.http.delete(`${this.apiUrl}/questions/${id}`)
  }

  findByTitle(title: string) {
    return this.http.get<Question[]>(`${this.apiUrl}/questions`, {
      params: {
        title: title
      }
    })
  }

  updateQuestionById(id: UUID | string, question: Question) {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`,
      question
    )
  }
}
