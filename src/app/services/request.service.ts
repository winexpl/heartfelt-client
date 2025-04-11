import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Request } from '../interfaces/request.interface';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  http = inject(HttpClient)
  private apiUrl = environment.apiUrl
  
  constructor() { }

  saveRequest(request: any) {
    return this.http.post<Request>(`${this.apiUrl}/requests`, request)
  }

  getAllRequests() {
    return this.http.get<Request[]>(`${this.apiUrl}/requests`)
  }

  deleteRequest(id: UUID | string) {
    return this.http.delete(`${this.apiUrl}/requests/${id}`)
  }
}
