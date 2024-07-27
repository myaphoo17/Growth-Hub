import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
      Swal.fire({
        title: 'Error!',
        text: 'Please select a file first.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('http://localhost:8080/admin/employerupload', formData)
      .subscribe(
        response => {
          Swal.fire({
            title: 'Success!',
            text: 'File uploaded successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          console.log('File uploaded successfully', response);
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file', error);
          this.handleError(error);
        }
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) {
      Swal.fire({
        title: 'Error!',
        text: 'Invalid file format. Please upload an Excel file.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else if (error.status === 500) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred on the server. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}
