import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-upload',
  templateUrl: './employee-upload.component.html',
  styleUrls: ['./employee-upload.component.css']
})
export class EmployeeUploadComponent {
  selectedFile: File | null = null;
  
  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/admin/employerupload', formData)
      .subscribe(
        response => {
          console.log('File uploaded successfully', response);
          alert('File uploaded successfully');
          this.router.navigate(['/success-page']);  // Navigate to a success page or desired route
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file', error);
          this.handleError(error);
        }
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      alert('Invalid file format. Please upload an Excel file.');
    } else if (error.status === 500) {
      alert('An error occurred on the server. Please try again later.');
    } else {
      alert('An unexpected error occurred. Please try again.');
    }
  }
}
