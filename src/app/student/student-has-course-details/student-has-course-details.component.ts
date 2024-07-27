import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { LoadingService } from '../../pageloading/loading.service';
import { EditEducationModel } from '../../models/instructor/EditVideoFileModel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';

@Component({
  selector: 'app-student-has-course-details',
  templateUrl: './student-has-course-details.component.html',
  styleUrls: ['./student-has-course-details.component.css']
})
export class StudentHasCourseDetailsComponent implements OnInit {
  fileId!: string;
  id!: string;
  courses: StdentCourseModel[] = [];

  showInstructorModal = false;
  showInsertModal = false;
  showEditModal = false;
  showDeleteModal = false;
  videos: UploadFiles[] = [];
  currentVideoIndex = 0;
  currentVideo: UploadFiles | null = null;
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
    private http: HttpClient
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
          this.currentVideo = this.videos[0];
        }
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    this.currentVideo = this.videos[this.currentVideoIndex];
    this.updateVideoSource();
    this.trackVideoSelection();
  }

  updateVideoSource(): void {
    const videoElement = this.renderer.selectRootElement('.selected-video', true);
    const videoUrl = this.currentVideo?.url ?? '';
    this.renderer.setAttribute(videoElement, 'src', videoUrl);
    videoElement.load();
    this.cdr.detectChanges();
  }

  trackVideoSelection(): void {
    const selectedVideo = this.currentVideo;
    if (selectedVideo) {
      console.log(`Video selected: ${selectedVideo.title}`);
      // Here you can add additional tracking logic, such as sending data to a tracking service
    }
  }

  confirmDownload(event: MouseEvent) {
    if (!confirm('Do you want to download the file?')) {
      event.preventDefault(); // Prevent default action (download) if not confirmed
    }
  }

  getFileType(url: string | undefined): string {
    if (!url) return 'document';
    const videoExtensions = ['.mp4', '.avi', '.mkv'];
    const pdfExtensions = ['.pdf'];
    const pptxExtensions = ['.pptx'];
    const xlsxExtensions = ['.xlsx'];
    const docxExtensions = ['.docx'];
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension) {
      if (videoExtensions.includes('.' + extension)) return 'video';
      if (pdfExtensions.includes('.' + extension)) return 'pdf';
      if (pptxExtensions.includes('.' + extension)) return 'pptx';
      if (xlsxExtensions.includes('.' + extension)) return 'xlsx';
      if (docxExtensions.includes('.' + extension)) return 'docx';
    }
    return 'document';
  }
}
