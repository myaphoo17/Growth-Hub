
import { LoginServiceService } from '../services/login-service.service';
import { forGetPassModel } from '../model/forgetPassModel';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  otp: string = ''; // For storing the OTP input
  message: string = '';
  isError: boolean = false;
  isOtpSent: boolean = false;
  mailBoxClose:boolean =true;
  newPass:boolean =false;
  model: forGetPassModel = {} as forGetPassModel;
  confirmPassword: string = '';

  constructor(private loginService: LoginServiceService, private router: Router) {}
  onSubmit() {
    this.loginService.checkingEmail(this.email).subscribe(
      (data) => {
        this.model = data;
        if (this.model.message) {
          this.message = this.model.message;
        }
        if (this.model.otp) {
          this.isOtpSent = true;
          this.mailBoxClose=false;
          sessionStorage.setItem('otp', this.model.otp);
          sessionStorage.setItem('email', this.model.email);
          this.setOtpExpiry();
        }
        this.isError = false;
      },
      error => {
        this.isError = true;
        this.message = error;  // Set the error message
      }
    );
  }
  verifyOtp() {
    const storedOtp = sessionStorage.getItem('otp');
    if (this.otp === storedOtp) {
      this.isOtpSent=false;
      this.newPass=true;
      this.message = 'Create  New Password';
    } else {
      this.message = 'Invalid OTP. Please try again.';
      this.isError = true;
    }
  }
  updatePassword() {
    if (this.model.newPass !== this.confirmPassword) {
      this.isError = true;
      this.message = 'Enter Password are not match! Please ReEnter';
      return;
    }
    this.model.email = sessionStorage.getItem('email') || '';
    this.loginService.updatePassword(this.model).subscribe(
      (data) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isError = true;
        this.message = 'An error occurred while updating the password. Please try again later.';
      }
    );
  }
  setOtpExpiry() {
    setTimeout(() => {
      sessionStorage.removeItem('otp');
      this.isOtpSent = false; // Hide the OTP input after expiry
    }, 300000); // 5 minutes in milliseconds
  }
}
