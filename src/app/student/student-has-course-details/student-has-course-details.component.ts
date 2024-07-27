import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { LoadingService } from '../../pageloading/loading.service';
import { EditEducationModel } from '../../models/instructor/EditVideoFileModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-student-has-course-details',
  templateUrl: './student-has-course-details.component.html',
  styleUrls: ['./student-has-course-details.component.css']
})
export class StudentHasCourseDetailsComponent implements OnInit {
  fileId!: string;
  id!: string;
  showInstructorModal = false;
  showInsertModal = false;
  showEditModal = false;
  showDeleteModal = false;
  videos: UploadFiles[] = [];
  currentVideoIndex = 0;
  newVideo = { title: '', file: null };
  selectedFile: File | null = null;
  updateVideoFileModel: EditEducationModel = {} as EditEducationModel;
  newVideoFileModel: EditEducationModel = {} as EditEducationModel;
  showSuccessModal = false;
  private videoIdCounter = 0;

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
          this.currentVideoIndex = 0;
        }
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    this.updateVideoSource();
  }

  updateVideoSource(): void {
    const videoElement = this.renderer.selectRootElement('.selected-video', true);
    this.renderer.setAttribute(videoElement, 'src', this.videos[this.currentVideoIndex]?.url || '');
    videoElement.load();
    this.cdr.detectChanges();
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

    this.loadingService.show();

    this.http.post('http://localhost:8080/instructor/updateVideoFile', formData)
      .subscribe(
        (response) => {
          console.log(response);
          this.loadingService.hide();
          this.showSuccessModal = true;
        },
        (error: HttpErrorResponse) => {
          this.loadingService.hide();
          console.error('Error updating video file', error);
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


  getFileType(url: string): string {
    const videoExtensions = ['.mp4', '.avi', '.mkv'];
    if (url) {
      const extension = url.split('.').pop()?.toLowerCase();
      if (extension && videoExtensions.includes('.' + extension)) {
        return 'video';
      }
    }
    return 'document';
  }
  confirmDownload(event: MouseEvent) {
    if (!confirm('Do you want to download the file?')) {
      event.preventDefault(); // Prevent default action (download) if not confirmed
    }
  }
}
