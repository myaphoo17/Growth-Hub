import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  showPassword: boolean = false; // Variable to control password visibility

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
          this.getRole = response.role; // Received role from backend 
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
                this.showToast('Login successful', 'success');
              }
              break;
            case 'Instructor':
              if (!response.defaultPasswordChange) {
                this.router.navigate(['change_pass']);
              } else {
                this.router.navigate(['instructor/int-home']);
                this.showToast('Login successful', 'success');
              }
              break;
            case 'Student':
              if (!response.defaultPasswordChange) {
                this.router.navigate(['change_pass']);
              } else {
                this.router.navigate(['student/stu-home']);
                this.showToast('Login successful', 'success');
              }
              break;
            default:
              this.router.navigate(['/']);
              this.showToast('Login successful', 'success');
              break;
          }
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
