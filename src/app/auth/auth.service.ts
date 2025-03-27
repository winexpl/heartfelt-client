import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, tap, throwError } from 'rxjs';
import { TokenResponse } from './auth.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode"
import { UUID } from 'crypto';
import { Role, User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)
  private cookieService = inject(CookieService)
  
  constructor() { }

  private apiUrl = environment.apiUrl

  get isAuth() {
    console.log(this.getToken());
    return !!this.getToken();
  }

  get id() {
    return jwtDecode<{id:UUID}>(this.getToken()!).id;
  }

  get username() {
    return jwtDecode<{sub:string}>(this.getToken()!).sub;
  }

  get roles() {
    return jwtDecode<{roles:Role[]}>(this.getToken()!).roles;
  }

  editPassword(payload: {oldPassword: string, newPassword: string}) {
    return this.http.put(`${this.apiUrl}/edit_password`, payload)
  }

  register(payload: {username: string, password: string}) {
    return this.http.post<User>(
      `${this.apiUrl}/registration`,
      payload
    )
  }

  login(payload: {username: string, password: string}) {
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/login`,
      payload, {
        withCredentials: true,
      }
    ).pipe(
      tap(res => {
        this.saveToken(res);
      })
    )
  }

  refresh() {
    console.log("refresh!")
    return this.http.post<TokenResponse>(
      `${this.apiUrl}/refresh_token`, 
      null,
      {
        withCredentials: true,
      }
    ).pipe(
      tap(res => this.saveToken(res)),
      catchError(err => {
        this.logout()
        return throwError(() => err)
      })
    )
  }

  logout() {
    this.cookieService.deleteAll();
    this.deleteToken()
    this.router.navigate(['/login'])
  }

  saveToken(res: TokenResponse) {
    localStorage.setItem('access_token', res.accessToken)
  }

  getToken() {  
    return localStorage.getItem('access_token')
  }

  deleteToken() {
    localStorage.clear()
  }
}


