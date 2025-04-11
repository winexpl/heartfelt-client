import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Claim } from '../interfaces/claim.interface';
import { environment } from '../../environments/environment';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl;
  constructor() { }

  getAllClaims() {
    return this.http.get<Claim[]>(`${this.apiUrl}/claims`)
  }

  saveClaim(claim: any) {
    return this.http.post<Claim>(`${this.apiUrl}/claims`,
      claim
    )
  }

  deleteClaim(id: UUID | string) {
    return this.http.delete(`${this.apiUrl}/claims/${id}`)
  }
}
