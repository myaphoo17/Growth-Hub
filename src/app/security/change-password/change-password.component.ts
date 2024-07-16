import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  responseMessage: string = '';
  staffId: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: LoginServiceService,
    private router: Router
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value || '';
      this.staffId = sessionStorage.getItem('userId') || '';
      this.authService.changePassword(newPassword, this.staffId).subscribe(
        response => {
          this.responseMessage = 'Password changed successfully.';
          setTimeout(() => {
            this.router.navigate(['login']); // Navigate to a suitable route after changing password
          }, 2000);
        },
        error => {
          this.responseMessage = error.error.errorMessage || 'Password changed successfully.Login Use';
          setTimeout(() => {
            this.router.navigate(['login']); // Navigate to a suitable route after changing password
          }, 1400);
        }
      );
    }
  }
}
