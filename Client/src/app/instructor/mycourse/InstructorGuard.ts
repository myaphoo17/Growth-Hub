import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../../security/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class InstructorGuard implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.getRole() === 'Instructor') {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
