import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employer } from '../../models/admin/employer';
import { UserService } from '../../chat/service/user.service';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { switchMap, of } from 'rxjs'; // Import 'of' here
import { CourseModelDTO } from '../../models/instructor/courseModelDTO';
import { ExamAnswerCountModel } from '../../models/student/ExamAnswerCountModel';

@Component({
  selector: 'app-certificate-view',
  templateUrl: './certificate-view.component.html',
  styleUrls: ['./certificate-view.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
})
export class CertificateViewComponent implements OnInit {
  courses: StdentCourseModel[] = [];
  id!: string;
  pageSize = 8;
  pageIndex = 0;
  pagedCards: StdentCourseModel[] = [];
  staffId!: string;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role = sessionStorage.getItem('role');
  enrolledCount: number | undefined;
  isHiddenChat = true;
  searchTerm: string = '';
  employers: Employer[] = [];
  showInstructorModal = false;
  instructorId!: number;
  examAnswercount!: number;
  displayCount!: number;
  loading: boolean = true;
  check = sessionStorage.getItem('userId');
  instructorInformation: Employer = {} as Employer;
  error: string | undefined; // Define the error property

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private studentService: StudentprofileService,
    private cdr: ChangeDetectorRef,
    private employerService: EmployerServiceService,
    private userServ: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize user role flags
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';

    // Set loading to true before starting data fetch
    this.loading = true;

    // Retrieve staffId from route parameters
    this.route.paramMap.pipe(
      switchMap(params => {
        const encodedId = params.get('staffId');
        this.staffId = encodedId ? Base64.decode(encodedId) : '';

        if (!this.staffId) {
          // Handle case where staffId is not present
          this.loading = false;
          return of([]); // Return an empty observable
        }

        return this.studentService.getCertificateCourses(this.staffId);
      })
    ).subscribe({
      next: (courses: StdentCourseModel[]) => {
        this.courses = courses;
        this.courses.forEach(course => {
          this.instructorId = course.employeeDTO.sr;
          course.uploadFilesDTO = course.uploadFilesDTO || [];
          course.categoriesDTO = course.categoriesDTO || { name: '' };
          
          // Fetch additional details for each course
          this.getEnrollmentCount(course.id);
          this.getExamAnswerCount(course.id, this.staffId);
          this.getEmployers(Number(course.id));
        });

        // Set loading to false after data is loaded
        this.loading = false;
      },
      error: (e) => {
        this.error = 'Error fetching courses';
        console.error(this.error, e);
        
        // Set loading to false in case of an error
        this.loading = false;
      }
    });
  }

  closeInstructorModal(): void {
    this.showInstructorModal = false;
  }

  toggleInstructorModal(): void {
    this.showInstructorModal = true;
    this.employerService.getEmployerByDbId(this.instructorId).subscribe({
      next: (data) => {
        this.instructorInformation = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (e) => console.error('Error fetching instructor information', e),
    });
  }

  dropDownMenueChat() {
    this.isHiddenChat = !this.isHiddenChat;
  }

  private getEmployers(courseId: number): void {
    this.studentService.getEnrolledStudent(courseId).subscribe(
      (data: Employer[]) => {
        this.employers = data;
      },
      error => {
        console.error('Error fetching enrolled students:', error);
      }
    );
  }

  get filteredEmployers(): Employer[] {
    return this.employers.filter(user =>
      (user.name && user.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  navigateToProfileViewPage(staffId: string) {
    this.router.navigate(['/admin/profile-view', this.encodeId(staffId)]).then(() => {
      setTimeout(() => {
      }, 50);
    });
  }

  toggleChatBox(): void {
    this.isHiddenChat = !this.isHiddenChat;
  }

  getExamAnswerCount(courseId: string, staffId: string): void {
    this.studentService.getExamAnswercountCourses(staffId, courseId).subscribe((courses: ExamAnswerCountModel) => {
      // Assuming you want to display the sum of examAnswercount + 1
      this.enrolledCount = courses.count;
      
      console.log("enroll count " + this.enrolledCount);
      this.displayCount = this.enrolledCount + 1; // Store original count + 1
      console.log('Display count:', this.displayCount);
    });
  }

  getEnrollmentCount(courseId: string): void {
    this.studentService.getEnrollmentCount(courseId)
      .subscribe((count: number) => this.enrolledCount = count);
    console.log("enroll count" + this.enrolledCount);
  }

  showDetails(course: StdentCourseModel) {
    course.showDetail = true;
  }

  hideDetails(course: StdentCourseModel) {
    course.showDetail = false;
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  private getCourses(): void {
    this.studentService.getCertificateCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          this.instructorId = course.employeeDTO.sr;
          course.uploadFilesDTO = course.uploadFilesDTO || []; 
          course.categoriesDTO = course.categoriesDTO || { name: '' }; 
          this.getEnrollmentCount(course.id);
          this.getExamAnswerCount(course.id, this.staffId);
          this.getEmployers(Number(course.id));
        });
      },
      error: (e) => console.error(e),
    });
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

  navigateToAssignment(courseId: string): void {
    let route: string;
    switch (this.role) {
      case 'Student':
        route = '/student/all-assignments';
        break;
      case 'Instructor':
        route = '/instructor/all-assignments';
        break;
      default:
        console.error('Invalid user role');
        return;
    }
    this.router.navigate([route], { queryParams: { courseId: this.encodeId(courseId), staffId: this.encodeId(this.staffId) } });
  }

  getFileType(url: string): string {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.ogg'];
    if (url) {
      const extension = url.split('.').pop()?.toLowerCase();
      if (extension && videoExtensions.includes('.' + extension)) {
        return 'video';
      } else if (['.pptx', '.ppt', '.pdf', '.xlsx', '.xls', '.docx'].includes('.' + extension)) {
        return 'document';
      }
    }
    return 'other';
  }

  getVideoFiles(files: UploadFiles[]): UploadFiles[] {
    return files.filter(file => this.getFileType(file.url) === 'video');
  }

  getDocumentFiles(files: UploadFiles[]): UploadFiles[] {
    return files.filter(file => this.getFileType(file.url) === 'document');
  }
}
