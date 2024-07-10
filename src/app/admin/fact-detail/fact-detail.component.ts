import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../pageloading/loading.service';
import { HttpClient } from '@angular/common/http';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { ApproveModel } from '../../models/admin/ApprovedModel';
import { CourseModel } from '../../models/instructor/courseModel';
import { Employer } from '../../models/admin/employer';

@Component({
  selector: 'app-fact-detail',
  templateUrl: './fact-detail.component.html',
  styleUrl: './fact-detail.component.css'
})
export class FactDetailComponent implements OnInit{
  fileId!: string;
  id!: string;
  instructorId!: number;
  showInstructorModal = false;
  videos: UploadFiles[] = [];
  courses: CourseModel[] = [];
  currentVideoIndex = 0;
  videosPerPage = 4;
  newVideo = { title: '', file: null };
  selectedFile: File | null = null;
  private videoIdCounter = 0; // Counter for generating unique IDs
  approveModel: ApproveModel = {} as ApproveModel;
  instructorInformation: Employer = {} as Employer;
  showSuccessModal = false;

  constructor(
    private route: ActivatedRoute,
    private instructorService: ProfileService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private loadingService: LoadingService,
    private employerService:EmployerServiceService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('id');
      this.id = encodedId ? Base64.decode(encodedId) : '';
      const adminId = sessionStorage.getItem('userId');
      this.approveModel.courseId =this.id;
      this.approveModel.adminId =adminId as string;
      this.getCoursesById(this.id);
      this.getCourses();
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
  private getCourses(): void {
    this.instructorService.getUnApprovedCourseList().subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          course.employeeDTO = course.employeeDTO || { sr: '' };
          this.instructorId =course.employeeDTO.sr;
        });
      },
      error: (e) => console.error(e),
    });
  }
   approveCourse() {
    this.employerService.approvedCourse(this.approveModel).subscribe({
      next: (data) => {
        this.showSuccessModal=true;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (e) => console.error(e),
    });
  }
  toggleInstructorModal(): void {
    this.showInstructorModal = true;
    this.employerService.getEmployerByDbId(this.instructorId).subscribe({
      next: (data) => {
        this.instructorInformation = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (e) => console.error(e),
    });
  }
  closeInstructorModal(): void {
    this.showInstructorModal = false;
  }
  selectVideo(index: number): void {
    this.currentVideoIndex = index;
    console.log('Selected video URL:', this.videos[this.currentVideoIndex]?.url);
    this.updateVideoSource();
  }

  updateVideoSource(): void {
    const videoElement = this.renderer.selectRootElement('.selected-video', true);
    this.renderer.setAttribute(videoElement, 'src', this.videos[this.currentVideoIndex]?.url || '');
    videoElement.load(); // Reload the video element
    this.cdr.detectChanges(); // Manually trigger change detection
  }
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }
  redirectToCreationPage() {
    this.showSuccessModal = false;
    this.router.navigate(['/admin/adm-home/fact-check']); // Adjust the route as needed
    // window.location.reload();
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
    }
  }

  generateUniqueId(): string {
    return `video-${this.videoIdCounter++}`;
  }

  onScroll(event: any): void {
    console.log('Scrolled:', event);
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
}

