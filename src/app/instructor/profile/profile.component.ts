import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileService } from '../../services/instructor/profile.service';
import { Employer } from '../../models/admin/employer';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Education } from '../../models/instructor/education.model';
import { LoadingService } from '../../pageloading/loading.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  userId: string = sessionStorage.getItem('userId') || '';
  dbId: string = sessionStorage.getItem('dbId') || '';
  instructorData: Employer = {} as Employer;
  selectedFile: File | null = null;
  educations: Education[] = [];
  newEducation: Education = {} as Education;
  editedEducation: Education = {} as Education;
  currentEditIndex: number | null = null;
  refreshInterval: any;
  id: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: string = ''; 

  constructor(
    private instructorService: ProfileService, 
    private http: HttpClient, 
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.instructorProfile();
    this.getEducation();
    this.refreshInterval = setInterval(() => {
      this.instructorProfile();
      this.getEducation();
    }, 10000); // Adjust the interval as needed
  } 

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  instructorProfile(): void {
    this.instructorService.getInstructorProfileById(this.userId).subscribe({
      next: (data) => {
        this.instructorData = data;
      },
      error: (e) => console.error(e),
    });
  }

  getEducationById(id: string): void {
    this.instructorService.getEducationById(id).subscribe({
      next: (data) => {
        this.editedEducation = data;
        this.openModal('editEducationModal');
      },
      error: (e) => {
        console.error(e);
        this.showToastMessage('Error fetching education details', 'error');
      }
    });
  }

  deleteEducationById(id: string): void {
    this.instructorService.deleteEducation(id).subscribe({
      next: () => {
        this.showToastMessage('Education deleted successfully', 'success');
        this.getEducation(); // Refresh education list after deletion
      },
      error: (e) => {
        console.error(e);
        this.showToastMessage('Error deleting education', 'error');
      }
    });
  }

  getEducation(): void {
    this.instructorService.getEducations(this.dbId).subscribe({
      next: (data) => {
        this.educations = data;
      },
      error: (e) => console.error(e),
    });
  }

  openModal(modalId: string): void {
    console.log(`Opening modal with ID: ${modalId}`); // Debug log
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'block';
      console.log(`Modal with ID ${modalId} found and displayed.`); // Debug log
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  closeModal(modalId: string): void {
    console.log(`Closing modal with ID: ${modalId}`); // Debug log
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      console.log(`Modal with ID ${modalId} found and hidden.`); // Debug log
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }

  addEducation(): void {
    if (!this.newEducation) {
      console.error('No Education data provided');
      this.showToastMessage('No Education data provided', 'error');
      return;
    }
    this.instructorService.addEducation(this.dbId, this.newEducation).subscribe({
      next: (data) => {
        console.log('Education added successfully:', data);
        this.showToastMessage('Education added successfully', 'success');
        this.getEducation(); // Refresh education list
        this.closeModal('addEducationModal');
      },
      error: (e) => {
        console.error('Error adding education:', e);
        this.showToastMessage('Error adding education', 'error');
      }
    });
  }

  editEducation(education: Education): void {
    console.log('editEducation called with education:', education); // Debug log
    this.editedEducation = { ...education };
    this.openModal('editEducationModal');
  }

  saveEditedEducation(): void {
    if (!this.editedEducation) {
      console.error('No Education selected for editing');
      this.showToastMessage('No Education selected for editing', 'error');
      return;
    }
    this.instructorService.updateEducation(this.editedEducation.id, this.editedEducation).subscribe({
      next: (data) => {
        console.log('Education updated successfully:', data);
        this.showToastMessage('Education updated successfully', 'success');
        this.getEducation(); // Refresh education list
        this.closeModal('editEducationModal');
      },
      error: (e) => {
        console.error('Error updating education:', e);
        this.showToastMessage('Error updating education', 'error');
      }
    });
  }  

  updateProfileInfo(): void {
    if (!this.instructorData) {
      console.error('No instructor data provided');
      this.showToastMessage('No instructor data provided', 'error');
      return;
    }
    this.instructorService.updateInstructorInfo(this.userId, this.instructorData).subscribe({
      next: (data) => {
        console.log('Profile updated successfully:', data);
        this.showToastMessage('Profile updated successfully', 'success');
        this.closeModal('updateProfileInfoModal');
      },
      error: (e) => {
        console.error('Error updating profile:', e);
        this.showToastMessage('Error updating profile', 'error');
      }
    });
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
      this.showToastMessage('Please select a file first.', 'error');
      return;
    }
  
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!validImageTypes.includes(this.selectedFile.type)) {
      this.showToastMessage('Invalid file format. Please upload an image file.', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('staffId', this.userId);
  
    this.loadingService.show(); // Show loader before starting async operation
  
    this.http.post('http://localhost:8080/instructor/updateProfile', formData)
      .subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          this.showToastMessage('Profile photo updated successfully', 'success');
          this.loadingService.hide(); // Hide loader on success
          this.instructorProfile(); // Refresh profile data
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide(); // Hide loader on error
          console.error('Error uploading file', error);
          if (error.status === 400) {
            this.showToastMessage('Invalid file format. Please upload an image file.', 'error');
          } else if (error.status === 500) {
            this.showToastMessage('An error occurred on the server. Please try again later.', 'error');
          } else {
            this.showToastMessage('An unexpected error occurred. Please try again.', 'error');
          }
        }
      );
    this.closeModal('updateProfilePhotoModal');
  }
  
  showToastMessage(message: string, type: string): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
