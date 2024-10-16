import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employer } from '../../models/student/employer';
import { Education } from '../../models/student/education.model';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private studentService: StudentprofileService, private http: HttpClient, private snackBar: MatSnackBar) {}

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

  private showToast(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,  // Adjust duration as needed
      panelClass: type === 'success' ? 'toast-success' : 'toast-error',
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  studentProfile(): void {
    this.studentService.getStudentProfileById(this.userId).subscribe({
      next: (data: Employer) => {
        this.studentData = data;
        this.showToast('Profile data fetched successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to fetch profile data', 'error');
      },
    });
  }

  getEducationById(id: string): void {
    this.studentService.getEducationById(id).subscribe({
      next: (data: Education) => {
        this.editedEducation = data;
        this.openModal('editEducationModal');
        this.showToast('Education data fetched successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to fetch education data', 'error');
      },
    });
  }

  deleteEducationById(id: string): void {
    this.studentService.deleteEducation(id).subscribe({
      next: () => {
        this.getEducation(); // Refresh education list after deletion
        this.showToast('Education deleted successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to delete education', 'error');
      },
    });
  }

  getEducation(): void {
    this.studentService.getEducations(this.dbId).subscribe({
      next: (data: Education[]) => {
        this.educations = data;
        this.showToast('Education data fetched successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to fetch education data', 'error');
      },
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
      this.showToast('No Education data provided', 'error');
      return;
    }
    this.studentService.addEducation(this.dbId, this.newEducation).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getEducation(); // Refresh education list
        this.showToast('Education added successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to add education', 'error');
      },
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
      this.showToast('No Education selected for editing', 'error');
      return;
    }
    this.studentService.updateEducation(this.editedEducation.id, this.editedEducation).subscribe({
      next: (data: any) => {
        console.log(data);
        this.getEducation(); // Refresh education list
        this.showToast('Education updated successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to update education', 'error');
      },
    });
    this.closeModal('editEducationModal');
  }

  updateProfileInfo(): void {
    if (!this.studentData) {
      console.error('No employer selected');
      this.showToast('No employer selected', 'error');
      return;
    }
    this.studentService.updateStudentInfo(this.userId, this.studentData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.showToast('Profile updated successfully', 'success');
      },
      error: (e: any) => {
        console.error(e);
        this.showToast('Failed to update profile', 'error');
      },
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
      this.showToast('Please select a file first', 'error');
      return;
    }

    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(this.selectedFile.type)) {
      this.showToast('Invalid file format. Please upload an image file.', 'error');
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
          this.showToast('Profile photo updated successfully', 'success');
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file', error);
          if (error.status === 400) {
            this.showToast('Invalid file format. Please upload an image file.', 'error');
          } else if (error.status === 500) {
            this.showToast('An error occurred on the server. Please try again later.', 'error');
          } else {
            this.showToast('An unexpected error occurred. Please try again.', 'error');
          }
        }
      );
    this.closeModal('updateProfilePhotoModal');
  }
}
