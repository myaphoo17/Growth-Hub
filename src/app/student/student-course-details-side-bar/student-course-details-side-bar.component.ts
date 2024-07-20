import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-student-course-details-side-bar',
  templateUrl: './student-course-details-side-bar.component.html',
  styleUrls: ['./student-course-details-side-bar.component.css']
})
export class StudentCourseDetailsSideBarComponent implements OnInit {
  modules = ['Module 1', 'Module 2'];
  selectedItem: string = 'Module 1';
  staffId: string = sessionStorage.getItem('userId') || '';
  courses: StdentCourseModel[] = [];
  selectedCourse: StdentCourseModel | undefined;
  courseId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentprofileService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id'); // Ensure this matches the parameter name in the route
      if (this.courseId) {
        console.log('Course ID from URL:', this.courseId); // Debug statement
        this.getCourseDetails(this.courseId);
      }
    });
  }

  private getCourseDetails(courseId: string): void {
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.selectedCourse = this.getCourseById(courseId);
        console.log('Selected Course:', this.selectedCourse); // Debug statement
      },
      error: (e) => console.error(e),
    });
  }

  getCourseById(courseId: string): StdentCourseModel | undefined {
    return this.courses.find(course => course.id === courseId);
  }

  selectItem(item: string): void {
    this.selectedItem = item;
    if (item === 'Grades') {
    }
  }
}
