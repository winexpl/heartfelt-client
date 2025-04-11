import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Role, User } from '../interfaces/user.interface';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl
  private http = inject(HttpClient)
  
  constructor() { }

  getRolesDescription(roles: Role[]): string[] {
    const rolesString: string[] = []
    for(const r of roles) {
      switch (r) {
        case Role.SUFFERY:
          rolesString.push('Пользователь')
          break
        case Role.PSYCHOLOG:
          rolesString.push('Психолог')
          break
        default:
          rolesString.push('Неизвестная роль')
          break
      }
    }
    return rolesString;
  }


  getUserById(id: UUID | string) {
    return this.http.get<User>(`${this.apiUrl}/users/id${id}`)
  }

  getUserByUsername(username: string) {
    return this.http.get<User>(`${this.apiUrl}/users/${username}`)
  }

  getAllUsersByUsername(username: string) {
    return this.http.get<User[]>(`${this.apiUrl}/users`, {
      params: {
        username: username
      }
    })
  }

  getAllUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
  }

  updateUser(id: UUID | string, user: User) {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user)
  }

  updateRole(id: UUID | string, role: Role) {
    const params = new HttpParams()
    .set('role', role);
    return this.http.put<User>(`${this.apiUrl}/admin/role/${id}`, null,
      { params })
  }
}
