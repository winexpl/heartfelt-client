import { inject, Injectable } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Question } from '../interfaces/question.interface';
import { Observable } from 'rxjs';
import { UUID } from 'crypto';
import { Answer } from '../interfaces/answer.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  authService = inject(AuthService);

  private stompClientForNewQuestions!: Client;
  private stompClientForAnswersInMyQuestion!: Client;
  private stompClientForAnswers!: Client;


  subscribeForNewQuestions?: StompSubscription;
  subscribeForAnswersInMyQuestion?: StompSubscription;
  subscribeForAnswers?: StompSubscription;

  connectForAnswers(): void {
    const token = this.authService.getToken();
    const socket3 = new SockJS('http://localhost:8080/ws');


    this.stompClientForAnswers = new Client({
      webSocketFactory: () => socket3,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    this.stompClientForAnswers.onStompError = (frame) => {
      console.error('WebSocket error', frame);
    };
    this.stompClientForAnswers.activate();
  }

  connectForAnswersInMyQuestion(): void {
    const token = this.authService.getToken();
    const socket2 = new SockJS('http://localhost:8080/ws');


    this.stompClientForAnswersInMyQuestion = new Client({
      webSocketFactory: () => socket2,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    this.stompClientForAnswersInMyQuestion.onStompError = (frame) => {
      console.error('WebSocket error', frame);
    };
    this.stompClientForAnswersInMyQuestion.activate();
  }
  connectForNewQuestions(): void {
    const token = this.authService.getToken();
    const socket1 = new SockJS('http://localhost:8080/ws');

    this.stompClientForNewQuestions = new Client({
      webSocketFactory: () => socket1,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    this.stompClientForNewQuestions.onStompError = (frame) => {
      console.error('WebSocket error', frame);
    };
    this.stompClientForNewQuestions.activate();
  }

  public subscribeToQuestions(): Observable<Question> {
    return new Observable<Question>((observer) => {
      this.stompClientForNewQuestions.onConnect = () => {
        console.log('Connected to WebSocket');
        this.subscribeForNewQuestions = this.stompClientForNewQuestions.subscribe('/topic/questions', (message) => {
          console.log('Получен новый вопрос:', message.body);
          const question = JSON.parse(message.body) as Question;
          observer.next(question);
        });
      };
    });
  }

  public unsubscribeFromQuestions(): void {
    if (this.subscribeForNewQuestions) {
      this.subscribeForNewQuestions.unsubscribe(); // Unsubscribe from the channel
      console.log('Отписка от канала subscribeForNewQuestions');
    } else {
      console.error('Нет активной подписки на subscribeForNewQuestions для удаления');
    }
  }

  public subscribeToAnswersForMyQuestions(): Observable<Answer> {
    return new Observable<Answer>((observer) => {
      this.stompClientForAnswersInMyQuestion.onConnect = () => {
        console.log('Connected to WebSocket subscribeToAnswersForMyQuestions');
        this.subscribeForAnswersInMyQuestion = this.stompClientForAnswersInMyQuestion.subscribe(
          `/topic/${this.authService.username}/questions/answer`,
          (message) => {
            console.log('Получен новый ответ на ваш вопрос:', message.body);
            const answer = JSON.parse(message.body) as Answer;
            observer.next(answer);
          }
        );
      };
    });
  }

  public unsubscribeFromAnswersInMyQuestions(): void {
    if (this.subscribeForAnswersInMyQuestion) {
      this.subscribeForAnswersInMyQuestion.unsubscribe(); // Unsubscribe from the channel
      console.log('Отписка от канала subscribeForAnswersInMyQuestion');
    } else {
      console.error('Нет активной подписки на subscribeForAnswersInMyQuestion для удаления');
    }
  }

  public subscribeToAnswers(questionId: UUID | string): Observable<Answer> {
    return new Observable<Answer>((observer) => {
      this.stompClientForAnswers.onConnect = () => {
        console.log('Connected to WebSocket');
        this.subscribeForAnswers = this.stompClientForAnswers.subscribe(`/topic/${questionId}/answers`, (message) => {
          console.log('Получен новый ответ:', message.body);
          const answer = JSON.parse(message.body) as Answer;
          observer.next(answer);
        });
      };
    });
  }

  public unsubscribeFromAnswers(): void {
    if (this.subscribeForAnswers) {
      this.subscribeForAnswers.unsubscribe(); // Unsubscribe from the channel
      console.log('Отписка от канала subscribeForAnswers');
    } else {
      console.error('Нет активной подписки на subscribeForAnswers для удаления');
    }
  }

  sendQuestion(question: Question): void {
    this.stompClientForNewQuestions.publish({
      destination: '/app/send-question',
      body: JSON.stringify(question),
      headers: { Authorization: `Bearer ${this.authService.getToken()}` } // Токен в заголовках
    });
  }

  sendAnswer(answer: Answer): void {
    this.stompClientForAnswersInMyQuestion.publish({
      destination: '/app/send-answer',
      body: JSON.stringify(answer),
      headers: { Authorization: `Bearer ${this.authService.getToken()}` } // Токен в заголовках
    });
  }

  disconnect(): void {
    if (this.stompClientForNewQuestions) {
      this.stompClientForNewQuestions.deactivate();
    }
    if (this.stompClientForAnswersInMyQuestion) {
      this.stompClientForAnswersInMyQuestion.deactivate();
    }
    if (this.stompClientForAnswers) {
      this.stompClientForAnswers.deactivate();
    }
  }
}
