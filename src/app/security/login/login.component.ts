import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { loginModel } from '../model/loginModel';
import { LoginServiceService } from '../services/login-service.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  getRole: string = '';

  constructor(
    private loginService: LoginServiceService,
    private authService: AuthServiceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      staffId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe(
        response => {
          this.getRole = response.role; // received role from backend 
          const token = response.token;
          this.authService.login(this.getRole, token);
          sessionStorage.setItem('userId', response.staffId);
          sessionStorage.setItem('dbId', response.dbId);
          sessionStorage.setItem('role', response.role);
          switch (this.getRole) {
            case 'Admin':
              if (!response.defaultPasswordChange) {
                this.router.navigate(['change_pass']);
              } else {
                this.router.navigate(['admin/adm-home']);
              }
              break;
            case 'Instructor':
              if (!response.defaultPasswordChange) {
                this.router.navigate(['change_pass']);
              } else {
                this.router.navigate(['instructor/int-home']);
              }
              break;
            case 'Student':
              if (!response.defaultPasswordChange) {
                this.router.navigate(['change_pass']);
              } else {
                this.router.navigate(['student/stu-home']);
              }
              break;
            default:
              this.router.navigate(['/']);
              break;
          }
          this.showToast('Login successful', 'success');
        },
        error => {
          this.showToast(error.error.errorMessage, 'error');
          console.log('Login failed', error);
        }
      );
    } else {
      this.showToast('Please fill out the form correctly', 'error');
    }
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,  // Adjust duration as needed
      panelClass: type === 'success' ? 'toast-success' : 'toast-error',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }
  
}
