import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../../pageloading/loading.service';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { StudentExamService } from '../../services/student/studentexam.service';

@Component({
  selector: 'app-student-course-details',
  templateUrl: './student-has-course-details.component.html',
  styleUrls: ['./student-has-course-details.component.css']
})
export class StudentHasCourseDetailsComponent implements OnInit {
  fileId!: string;
  id!: string;
  courses: StdentCourseModel[] = [];
  videos: UploadFiles[] = [];
  currentVideoIndex = 0;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role = sessionStorage.getItem('role');
  currentVideo: UploadFiles | null = null;
  hasExam: boolean = false;
  examDetails: any;
  staffId: string = sessionStorage.getItem('userId') || '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stuService: ProfileService,
    private sService: StudentprofileService,
    private studentExamService: StudentExamService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private loadingService: LoadingService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.route.paramMap.subscribe(params => {
      
      const encodedId = params.get('id');
      this.id = encodedId ? Base64.decode(encodedId) : '';
      this.getCoursesById(this.id);
      this.checkForExam(parseInt(this.id));
    });
  }

  get allVideosCompleted(): boolean {
    return this.videos.every(video => video.completed);
  }
  checkForExam(courseId: number): void {
    this.studentExamService.getExamDetailsByCourseId(courseId).subscribe(
      data => {
        this.examDetails = data;
        this.hasExam = true; // Set to true if data is not null or undefined
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error => {
        console.error('Error fetching exam details:', error);
        this.hasExam = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    );
  }

  navigateToStudentExam(courseId: string): void {
    let route: string;
    switch (this.role) {
      case 'Student':
        route = '/student/student-exam';
        break;
      case 'Instructor':
        route = '/instructor/student-exam';
        break;
      case 'Admin':
        route = '/admin/student-exam';
        break;
      default:
        console.error('Invalid user role');
        return;
    }
    this.router.navigate([route], { queryParams: { courseId: this.encodeId(courseId), staffId: this.encodeId(this.staffId) } });
  }
  encodeId(id: string): string {
    return Base64.encode(id);
  }

  get progressPercentage(): number {
    if (this.videos.length === 0) return 0;
    const completedCount = this.videos.filter(video => video.completed).length;
    return (completedCount / this.videos.length) * 100;
  }

  markAsDone(video: UploadFiles | null, event: Event): void {
    event.stopPropagation();

    if (video) {
      const newCompletionStatus = !video.completed;
      const videoId = Number(video.id);
      this.sService.markAsCompleted(videoId, newCompletionStatus).subscribe({
        next: (updatedVideo: UploadFiles) => {
          video.completed = updatedVideo.completed;
          if (this.currentVideo && this.currentVideo.id === video.id) {
            this.currentVideo.completed = video.completed;
          }
          this.updateProgress();
          this.cdr.detectChanges();
        },
        error: (e) => console.error(e),
      });
    }
  }
  // alreadyDone(courseid :number){
  //   this.sService.getVideosByCourseId(courseid).subscribe({

  //   })
  // }
  

  updateProgress(): void {
    // Additional UI updates related to progress
  }

  nextLesson(): void {
    const currentIndex = this.videos.findIndex(video => video.id === this.currentVideo?.id);
    if (currentIndex >= 0 && currentIndex < this.videos.length - 1) {
      this.selectVideo(currentIndex + 1);
    } else {
      console.log('No more lessons available.');
    }
  }

  previousLesson(): void {
    const currentIndex = this.videos.findIndex(video => video.id === this.currentVideo?.id);
    if (currentIndex > 0) {
      this.selectVideo(currentIndex - 1);
    } else {
      console.log('No previous lesson available.');
    }
  }

  private getCoursesById(id: string): void {
    this.stuService.getCourseListById(id).subscribe({
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
  }

  updateVideoSource(): void {
    const videoElement = this.renderer.selectRootElement('.selected-video', true);
    const videoUrl = this.currentVideo?.url ?? '';
    this.renderer.setAttribute(videoElement, 'src', videoUrl);
    videoElement.load();
    this.cdr.detectChanges();
  }

  confirmDownload(event: MouseEvent) {
    if (!confirm('Do you want to download the file?')) {
      event.preventDefault();
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