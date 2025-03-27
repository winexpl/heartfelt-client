import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';

export const canActivateRole = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) => {
    const requiredRole = route.data['role'];
    
    if(inject(AuthService).roles.includes(requiredRole)) {
      return true
    }
    return inject(Router).createUrlTree([''])
}

