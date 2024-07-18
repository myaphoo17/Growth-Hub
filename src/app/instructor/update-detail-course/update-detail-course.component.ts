import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../pageloading/loading.service';
import { EditEducationModel } from '../../models/instructor/EditVideoFileModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-detail-course',
  templateUrl: './update-detail-course.component.html',
  styleUrls: ['./update-detail-course.component.css']
})
export class UpdateDetailCourseComponent implements OnInit {
  fileId!: string;
  id!: string;
  showInstructorModal = false;
  showInsertModal = false;
  showEditModal = false;
  showDeleteModal = false;
  videos: UploadFiles[] = [];
  currentVideoIndex = 0;
  videosPerPage = 4;
  newVideo = { title: '', file: null };
  selectedFile: File | null = null;
  updateVideoFileModel: EditEducationModel = {} as EditEducationModel;
  newVideoFileModel: EditEducationModel = {} as EditEducationModel;
  showSuccessModal = false;
  private videoIdCounter = 0; // Counter for generating unique IDs

  constructor(
    private route: ActivatedRoute,
    private instructorService: ProfileService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private loadingService: LoadingService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      this.id = encodedId ? Base64.decode(encodedId) : '';
      this.getCoursesById(this.id);
    });
  }

  private getCoursesById(id: string): void {
    this.instructorService.getCourseListById(id).subscribe({
      next: (data) => {
        this.videos = data;
        if (this.videos.length > 0) {
          this.currentVideoIndex = 0; // Select the first video by default
        }
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (e) => console.error(e),
    });
  }

  navigateToExamDetail(): void {
    this.router.navigate(['/instructor/exam-detail'], { queryParams: { courseId: this.id } });
  }

<<<<<<< HEAD
  navigateToGrade(): void {
    this.router.navigate(['/instructor/grade-detail'], { queryParams: { courseId: this.id } });
  }

=======
  navigateToAssignment(): void {
    this.router.navigate(['/instructor/int-assignment'], { queryParams: { courseId: this.id } });
  }
  
>>>>>>> 79948e07ceb36d36466166aa86912dd2bb765859
  toggleInstructorModal(): void {
    this.showInstructorModal = !this.showInstructorModal;
  }

  openInsertModal(): void {
    this.showInsertModal = true;
  }

  toggleInsertModal(): void {
    this.showInsertModal = !this.showInsertModal;
  }

  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    console.log('Selected video URL:', this.videos[this.currentVideoIndex]?.url);
    this.updateVideoSource();
  }

  updateVideoSource(): void {
    const videoElement = this.renderer.selectRootElement('.selected-video', true);
    this.renderer.setAttribute(videoElement, 'src', this.videos[this.currentVideoIndex]?.url || '');
    // videoElement.load(); // Reload the video element
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  openEditModal(): void {
    this.updateVideoFileModel.title = this.videos[this.currentVideoIndex].title;
    this.updateVideoFileModel.id = this.videos[this.currentVideoIndex].id;
    this.showEditModal = true;
  }

  toggleEditModal(): void {
    this.showEditModal = !this.showEditModal;
  }

  saveEdit(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }
    const editedVideo = this.videos.find(video => video.id === this.updateVideoFileModel.id);
    if (editedVideo) {
      editedVideo.title = this.updateVideoFileModel.title;
    }
    this.toggleEditModal();
    this.updateVideoFileModel.courseId = this.id;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('id', this.updateVideoFileModel.id);
    formData.append('title', this.updateVideoFileModel.title);

    this.loadingService.show(); // Show loader before starting async operation

    this.http.post('http://localhost:8080/instructor/updateVideoFile', formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.loadingService.hide(); // Hide loader on success
          this.showSuccessModal = true; // Show success modal
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide(); // Hide loader on error
          console.error('Error update video file', error);
          if (error.status === 400) {
            alert('Invalid file format. Please upload an image file.');
          } else if (error.status === 500) {
            alert('An error occurred on the server. Please try again later.');
          } else {
            alert('An unexpected error occurred. Please try again.');
          }
        }
      );
  }

  redirectToCreationPage(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/instructor/profile']); // Adjust the route as needed
  }

  openDeleteModal(): void {
    this.updateVideoFileModel.id = this.videos[this.currentVideoIndex].id;
    this.showDeleteModal = true;
  }

  toggleDeleteModal(): void {
    this.showDeleteModal = !this.showDeleteModal;
  }

  confirmDelete(): void {
    this.toggleDeleteModal();
    this.instructorService.deleteUploadFile(this.updateVideoFileModel.id).subscribe({
      next: () => {
        this.videos.splice(this.currentVideoIndex, 1);
        this.currentVideoIndex = 0; // Reset to the first video after deletion
        this.updateVideoSource();
      },
      error: (e) => console.error(e),
    });
  }

  saveFile(): void {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }
    this.updateVideoFileModel.courseId = this.id;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('courseId', this.updateVideoFileModel.courseId);
    formData.append('title', this.updateVideoFileModel.title);

    this.loadingService.show(); // Show loader before starting async operation

    this.http.post('http://localhost:8080/instructor/saveOneVideoFile', formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.loadingService.hide(); // Hide loader on success
          this.showSuccessModal = true; // Show success modal
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide(); // Hide loader on error
          console.error('Error update video file', error);
          if (error.status === 400) {
            alert('Invalid file format. Please upload an image file.');
          } else if (error.status === 500) {
            alert('An error occurred on the server. Please try again later.');
          } else {
            alert('An unexpected error occurred. Please try again.');
          }
        }
      );
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.newVideo.title && this.newVideo.file) {
      const newVideoSrc = URL.createObjectURL(this.newVideo.file);
      const newVideo: UploadFiles = {
        id: this.generateUniqueId(), // Generate a unique string ID
        url: newVideoSrc,
        title: this.newVideo.title
      };
      this.videos.push(newVideo);
      this.newVideo = { title: '', file: null };
      this.toggleInsertModal();
    }
  }

  generateUniqueId(): string {
    return `video-${this.videoIdCounter++}`;
  }

  onScroll(event: any): void {
    console.log('Scrolled:', event);
  }

  getFileType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'video';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      case 'pptx':
        return 'pptx';
      case 'xlsx':
        return 'xlsx';
      case 'docx':
        return 'docx';
      default:
        return 'document'; // Default case for other document types
    }
  }
  confirmDownload(event: MouseEvent) {
    if (!confirm('Do you want to download the file?')) {
      event.preventDefault(); // Prevent default action (download) if not confirmed
    }
  }
}
