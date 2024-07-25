import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { Base64 } from 'js-base64';
import { UploadFiles } from '../../models/instructor/UploadFiles';

@Component({
  selector: 'app-student-course-details-side-bar',
  templateUrl: './student-course-details-side-bar.component.html',
  styleUrls: ['./student-course-details-side-bar.component.css']
})
export class StudentCourseDetailsSideBarComponent implements OnInit {
  staffId: string = sessionStorage.getItem('userId') || '';
  courses: StdentCourseModel[] = [];
  selectedCourse: StdentCourseModel | undefined;
  courseId: string | null = null;
  videos: UploadFiles[] = [];

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentprofileService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      if (this.courseId) {
        this.getCourseDetails(this.courseId);
      }
    });
  }

  private getCourseDetails(courseId: string): void {
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.selectedCourse = this.getCourseById(courseId);
      },
      error: (e) => console.error(e),
    });
  }

  getCourseById(courseId: string): StdentCourseModel | undefined {
    return this.courses.find(course => course.id === courseId);
  }
}
