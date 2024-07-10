import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.css']
})
export class EmployersComponent {
  selectedFile: File | null = null;
  
  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
        (response) => {
          console.log('File uploaded successfully', response);
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file', error);
          if (error.status === 400) {
            alert('Invalid file format. Please upload an Excel file.');
          } else if (error.status === 500) {
            alert('An error occurred on the server. Please try again later.');
          } else {
            alert('An unexpected error occurred. Please try again.');
          }
        }
      );
  }
}
