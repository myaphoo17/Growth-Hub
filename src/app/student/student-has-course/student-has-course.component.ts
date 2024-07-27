import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { ActivatedRoute , Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private studentService: StudentprofileService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.getCourses();
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
          course.uploadFilesDTO = course.uploadFilesDTO || []; 
          course.categoriesDTO = course.categoriesDTO || { name: '' }; 
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