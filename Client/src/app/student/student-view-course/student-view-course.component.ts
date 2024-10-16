import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Base64 } from 'js-base64';
import { CourseModel } from '../../models/instructor/courseModel';
import { Employer } from '../../models/admin/employer';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { ProfileService } from '../../services/instructor/profile.service';
import { StudentExamService } from '../../services/student/studentexam.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-view-course',
  templateUrl: './student-view-course.component.html',
  styleUrls: ['./student-view-course.component.css']
})
export class StudentViewCourseComponent implements OnInit {
  fileId!: string;
  id!: string;
  instructorId!: number;
  showInstructorModal = false;
  course: CourseModel = {} as CourseModel;
  instructorInformation: Employer = {} as Employer;
  staffId: string = sessionStorage.getItem('userId') || '';
  enrollStatus: boolean = false;
  enrollInst: boolean = false;
  enrolledCount: number | undefined;
  courseId!: string;
  hasExam: boolean = false;
  examDetails: any;
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role=sessionStorage.getItem('role');
  check = sessionStorage.getItem('userId');
  instructorStaffId!: string;
  isHiddenChat= true;
  searchTerm:string='';
  employers: Employer[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private studentService: StudentprofileService,
    private cdr: ChangeDetectorRef,
    private employerService: EmployerServiceService,
    private instructorSer: ProfileService,
    private studentExamService: StudentExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('courseId');
      this.id = encodedId ? Base64.decode(encodedId) : '';
      this.courseId = this.id;
      this.getCoursesById(this.id);
      this.checkForExam(parseInt(this.courseId));
    });
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
    let basePath = '';
  
    if (this.isAdmin) {
      basePath = '/admin/profile-view';
    } else if (this.isInstructor) {
      basePath = '/instructor/profile-view';
    } else if (this.isStudent) {
      basePath = '/student/profile-view';
    }
  
    this.router.navigate([basePath, this.encodeId(staffId)]).then(() => {
      setTimeout(() => {
        // Any additional logic that needs to happen after navigation
      }, 50);
    });
  }
  toggleChatBox(): void {
    this.isHiddenChat = !this.isHiddenChat;
  }
  dropDownMenueChat() {
    this.isHiddenChat = !this.isHiddenChat;
  }
  encodeId(id: string): string {
    return Base64.encode(id);
  }
  navigateToEnrolledUser(): void {
    this.router.navigate(['/admin/enrolled-user'], { queryParams: { courseId: this.encodeId(this.id) } });
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

  getCoursesById(courseId: string): void {
    this.studentService.getCourseDetailsById(courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.course.employeeDTO = this.course.employeeDTO || { sr: 0 };
        this.instructorId = this.course.employeeDTO.sr;
        this.checkInstructor(courseId);
        this.checkEmployee(courseId);
        this.getEmployers(Number(courseId));
        this.getEnrollmentCount(); // Fetch the enrollment count
      },
      error: (e) => console.error('Error fetching course details', e),
    });
  }

  checkEmployee(courseId: string): void {
    this.studentService.checkEmployeeExists(courseId, this.staffId).subscribe(
      (result: boolean) => {
        this.enrollStatus = result;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error checking employee existence', error);
        this.enrollStatus = false;
      }
    );
  }

  checkInstructor(courseId: string): void {
    this.instructorSer.checkEmployeeExists(courseId, this.staffId).subscribe(
      (result: boolean) => {
        this.enrollInst = result;
      },
      (error) => {
        console.error('Error checking instructor existence', error);
        this.enrollInst = false;
      }
    );
  }

  enrollCourse(staffId: string, courseId: string): void {
    this.studentService.enrollCourse(staffId, courseId).subscribe(
      response => {
        this.getCoursesById(courseId); // Remove the second argument
        console.log('Enrollment successful', response);
        let navigatePath = '';
        if (this.isAdmin) {
          navigatePath = '/admin/mycourses';
        } else if (this.isInstructor) {
          navigatePath = '/instructor/mycourses';
        } else if (this.isStudent) {
          navigatePath = '/student/mycourses';
        }
        this.webSocketService.sendMessageNotif(this.instructorStaffId, 'enroll course');
        this.router.navigate([navigatePath]);

        // Display success message using MatSnackBar
        this.snackBar.open('Enrollment successful!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
      },
      error => {
        console.error('Enrollment failed', error);
      }
    );
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

  // Method to determine the type of file
  getFileType(url: string): string {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.ogg'];
    const documentExtensions = ['.pptx', '.ppt', '.pdf', '.xlsx', '.xls', '.docx'];

    if (url) {
      const extension = url.split('.').pop()?.toLowerCase();
      if (extension) {
        if (videoExtensions.includes('.' + extension)) {
          return 'video';
        } else if (documentExtensions.includes('.' + extension)) {
          return 'document';
        }
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

  getVideoCount(files: UploadFiles[]): number {
    return this.getVideoFiles(files).length;
  }

  getDocumentCount(files: UploadFiles[]): number {
    return this.getDocumentFiles(files).length;
  }

  closeInstructorModal(): void {
    this.showInstructorModal = false;
  }

  getEnrollmentCount(): void {
    if (this.courseId) {
      this.studentService.getEnrollmentCount(this.courseId)
        .subscribe((count: number) => this.enrolledCount = count);
    }
  }
}
