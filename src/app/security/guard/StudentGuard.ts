import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && (this.authService.getRole() === 'Student')) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
