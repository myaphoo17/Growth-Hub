import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { ActivatedRoute , Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Employer } from '../../models/admin/employer';
import { UserService } from '../../chat/service/user.service';
import { EmployerServiceService } from '../../services/admin/employer.service.service';
import { StudentExamService } from '../../services/student/studentexam.service';

@Component({
  selector: 'app-student-has-course',
  templateUrl: './student-has-course.component.html',
  styleUrls: ['./student-has-course.component.css']
})

export class StudentHasCourseComponent implements OnInit {
  courses: StdentCourseModel[] = [];
  id!: string;
  pageSize = 8;
  pageIndex = 0;
  pagedCards: StdentCourseModel[] = [];
  staffId: string = sessionStorage.getItem('userId') || '';
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role = sessionStorage.getItem('role');
  enrolledCount: number | undefined;
  isHiddenChat= true;
  searchTerm:string='';
  employers: Employer[] = [];
  showInstructorModal = false;
  check = sessionStorage.getItem('userId');
  instructorId!: number;
  hasExam: boolean = false;
  examDetails: any;
  instructorInformation: Employer = {} as Employer;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private studentService: StudentprofileService,private studentExamService: StudentExamService,private cdr: ChangeDetectorRef,private employerService: EmployerServiceService,private userServ: UserService, private route: ActivatedRoute, private router: Router) {}
 
  ngOnInit() {
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.getCourses();
    
    
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

   
  getEnrollmentCount(courseId: string): void {
    
      this.studentService.getEnrollmentCount( courseId)
        .subscribe((count: number) => this.enrolledCount = count);
        console.log("enroll count"+this.enrolledCount)
    
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
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          this.instructorId = course.employeeDTO.sr;
          course.uploadFilesDTO = course.uploadFilesDTO || []; 
          course.categoriesDTO = course.categoriesDTO || { name: '' }; 
          this.getEnrollmentCount(course.id);
          this.getEmployers(Number(course.id));
          this.checkForExam(parseInt(course.id));
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
    return files.filter(file => this.getFileType(file.url) === 'document');}
//   }
//   onUnenroll(courseId: string): void {
//     const numericCourseId = Number(courseId);
//     if (isNaN(numericCourseId)) {
//       console.error('Invalid course ID, unable to unenroll');
//       return;
//     }

//     this.studentService.unenrollCourse(this.staffId, numericCourseId).subscribe({
//       next: (response) => {
//         console.log('Unenrolled successfully', response);
//         // Add logic to handle successful unenrollment, e.g., update the UI
//         this.courses = this.courses.filter(course => course.id !== courseId);
//       },
//       error: (e) => {
//         console.error('Error unenrolling', e);
//         // Add logic to handle the error, e.g., show an error message
//       }
//     });
//   }
// }

onUnenroll(courseId: string): void {
  const numericCourseId = Number(courseId);
  if (isNaN(numericCourseId)) {
    console.error('Invalid course ID, unable to unenroll');
    return;
  }

  // Show confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to unenroll from this course?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, unenroll',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with unenrollment
      this.studentService.unenrollCourse(this.staffId, numericCourseId).subscribe({
        next: (response) => {
          console.log('Unenrolled successfully', response);
                 this.courses = this.courses.filter(course => course.id !== courseId);

        },
        error: (e) => {
          console.error('Error unenrolling', e);
        }
      });
    } else {
      console.log('Unenrollment canceled');
    }
  });
}}