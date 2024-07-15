import { Component } from '@angular/core';
import { loginModel } from '../model/loginModel';
import { LoginServiceService } from '../services/login-service.service';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected styleUrls property
})
export class LoginComponent {
  loginData: loginModel = {} as loginModel;
  responseMessage: string = '';
  getRole:string='';
  constructor(private loginService: LoginServiceService,private authService:AuthServiceService,private router: Router) {}

  onSubmit() {
    this.loginService.login(this.loginData).subscribe(
      response => {
        this.getRole = response.role; // received role from backend 
        const token = response.token;
        this.authService.login(this.getRole,token);
        sessionStorage.setItem('userId', response.staffId);
        sessionStorage.setItem('dbId', response.dbId);
        switch(this.getRole) {
          case 'Admin':
            if (response.defaultPasswordChange == false) {
              this.router.navigate(['change_pass']);
            } else {
              this.router.navigate(['admin/adm-home']);
            }
            break;
          case 'Instructor':
            if (response.defaultPasswordChange == false) {
              this.router.navigate(['change_pass']);
            } else {
              this.router.navigate(['instructor/int-home']);
            }
            break;
          case 'Student':
            if (response.defaultPasswordChange == false) {
              this.router.navigate(['change_pass']);
            } else {
              this.router.navigate(['student/stu-home']);
            }
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
        console.log("login success ", response);
      },
      error => {
        this.responseMessage =error.error.errorMessage; // received error message from backend
        console.log('Login failed', error);
      }
    );
  }
}
