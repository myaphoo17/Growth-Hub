import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/courses';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { CourseModel } from '../../models/instructor/courseModel';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { Employer } from '../../models/admin/employer';
import { ProfileService } from '../../services/instructor/profile.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: CourseModel[] = [];
  loading: boolean = true;
  error: string | null = null;
  staffId: string = sessionStorage.getItem('userId') || '';
  enrollStatus: { [courseId: string]: boolean } = {};
  enrollInst: { [courseId: string]: boolean } = {};
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role=sessionStorage.getItem('role');
  course: CourseModel = {} as CourseModel;
  instructorInformation: Employer = {} as Employer;
  instructorStaffId!: string;

  constructor(
    private webSocketService: WebSocketService,
    private coursesService: CoursesService,
    private studentService: StudentprofileService,
    private instructorSer:ProfileService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    
  }

  ngOnInit(): void {
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('categoryId');
      this.fetchCourses(categoryId ? categoryId.toString() : undefined);
    });
    this.fetchCourses();
  }
  getCoursesById(courseId: string, callback: () => void): void {
    this.studentService.getCourseDetailsById(courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.course.employeeDTO = this.course.employeeDTO || { sr: '' };
        this.instructorStaffId = this.course.employeeDTO.staffId;
        console.log("Instructor staff id: " + this.instructorStaffId);
        this.checkEmployee(courseId); // Check enrollment status after course details are loaded
        callback();
      },
      error: (e) => {
        console.error(e);
        callback(); // Ensure callback is called even on error
      }
    });
}

  fetchCourses(categoryId?: string) {
    this.coursesService.getAllCourses().subscribe(
      (data: CourseModel[]) => {
        if (categoryId !== undefined) {
          this.courses = data.filter(course => Number(course.categoriesDTO.id) === Number(categoryId));
        } else {
          this.courses = data;
        }
        this.loading = false;
        this.courses = data;
        this.loading = false;
        this.checkEnrollments();
      },
      (error: any) => {
        this.error = 'Error fetching courses';
        this.loading = false;
        console.error(this.error, error);
      }
    );
  }

  checkEnrollments() {
    this.courses.forEach(course => {
      this.checkEmployee(course.id);
      this.checkInstructor(course.id);
    });
  }

  checkEmployee(courseId: string) {
    this.studentService.checkEmployeeExists(courseId, this.staffId).subscribe(
      (result: boolean) => {
        this.enrollStatus[courseId] = result;
      },
      (error) => {
        console.error('Error checking employee existence', error);
        this.enrollStatus[courseId] = false;
      }
    );
  }
  checkInstructor(courseId: string) {
    this.instructorSer.checkEmployeeExists(courseId, this.staffId).subscribe(
      (result: boolean) => {
        this.enrollInst[courseId] = result;
      },
      (error) => {
        console.error('Error checking employee existence', error);
        this.enrollInst[courseId] = false;
      }
    );
  }
  enrollCourse(staffId: string, courseId: string): void {
    this.studentService.enrollCourse(staffId, courseId).subscribe(
      response => {
        this.getCoursesById(courseId, () => {
          console.log('Enrollment successful', response);
          let navigatePath = '';
          if (this.isAdmin) {
            navigatePath = '/admin/mycourses';
          } else if (this.isInstructor) {
            navigatePath = '/instructor/mycourses';
          } else if (this.isStudent) {
            navigatePath = '/student/mycourses';
          }
          console.log("Instructor staff id: " + this.instructorStaffId);
          this.webSocketService.sendMessageNotif(this.instructorStaffId, 'enroll course');
          this.router.navigate([navigatePath]);
        });
      },
      error => {
        console.error('Enrollment failed', error);
      }
    );
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
    return files.filter(file => file.url.endsWith('.mp4')||  file.url.endsWith('.webm') || file.url.endsWith('.ogg')); // Add other video formats as needed
  }
  
  encodeId(id: string): string {
    return Base64.encode(id);
  }

  getDocumentFiles(files: UploadFiles[]): UploadFiles[] {
    return files.filter(file => this.getFileType(file.url) === 'document');
  }

}
