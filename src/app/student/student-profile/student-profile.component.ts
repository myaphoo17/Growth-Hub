import { Component, OnDestroy, OnInit } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employer } from '../../models/student/employer';
import { Education } from '../../models/student/education.model';
import { StudentprofileService } from '../../services/student/studentprofile.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  userId: string = sessionStorage.getItem('userId') || '';
  dbId: string = sessionStorage.getItem('dbId') || '';
  studentData: Employer = {} as Employer;
  selectedFile: File | null = null;
  educations: Education[] = [];
  newEducation: Education = {} as Education;
  editedEducation: Education = {} as Education;
  currentEditIndex: number | null = null;
  refreshInterval: any;

  constructor(private studentService: StudentprofileService, private http: HttpClient) {}

  ngOnInit(): void {
    this.studentProfile();
    this.getEducation();
    this.refreshInterval = setInterval(() => {
      this.studentProfile();
      this.getEducation();
    }, 50000); // Adjust the interval as needed
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  studentProfile(): void {
    this.studentService.getStudentProfileById(this.userId).subscribe({
      next: (data: Employer) => {
        this.studentData = data;
      },
      error: (e: any) => console.error(e),
    });
  }

  getEducationById(id: string): void {
    this.studentService.getEducationById(id).subscribe({
      next: (data: Education) => {
        this.editedEducation = data;
        this.openModal('editEducationModal');
      },
      error: (e: any) => console.error(e),
    });
  }

  deleteEducationById(id: string): void {
    this.studentService.deleteEducation(id).subscribe({
      next: () => {
        this.getEducation(); // Refresh education list after deletion
      },
      error: (e: any) => console.error(e),
    });
  }

  getEducation(): void {
    this.studentService.getEducations(this.dbId).subscribe({
      next: (data: Education[]) => {
        this.educations = data;
      },
      error: (e: any) => console.error(e),
    });
  }

  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  addEducation(): void {
    if (!this.newEducation) {
      console.error('No Education data provided');
      return;
    }
    this.studentService.addEducation(this.dbId, this.newEducation).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getEducation(); // Refresh education list
      },
      error: (e: any) => console.error(e),
    });
    this.closeModal('addEducationModal');
  }

  editEducation(education: Education): void {
    this.editedEducation = { ...education };
    this.openModal('editEducationModal');
  }

  saveEditedEducation(): void {
    if (!this.editedEducation) {
      console.error('No Education selected for editing');
      return;
    }
    this.studentService.updateEducation(this.editedEducation.id, this.editedEducation).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getEducation(); // Refresh education list
      },
      error: (e: any) => console.error(e),
    });
    this.closeModal('editEducationModal');
  }

  updateProfileInfo(): void {
    if (!this.studentData) {
      console.error('No employer selected');
      return;
    }
    this.studentService.updateStudentInfo(this.userId, this.studentData).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (e: any) => console.error(e),
    });
    this.closeModal('updateProfileInfoModal');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  updateProfilePhoto(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(this.selectedFile.type)) {
      alert('Invalid file format. Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('staffId', this.userId);

    this.http.post('http://localhost:8080/student/updateProfile', formData)
      .subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.studentProfile(); // Refresh profile data
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file', error);
          if (error.status === 400) {
            alert('Invalid file format. Please upload an image file.');
          } else if (error.status === 500) {
            alert('An error occurred on the server. Please try again later.');
          } else {
            alert('An unexpected error occurred. Please try again.');
          }
        }
      );
    this.closeModal('updateProfilePhotoModal');
  }
}
