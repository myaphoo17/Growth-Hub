import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/courses';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  loading: boolean = true;
  error: string | null = null;
  staffId: string = sessionStorage.getItem('userId') || '';
  
  constructor(
    private coursesService: CoursesService,
    private studentService: StudentprofileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses() {
    this.coursesService.getAllCourses().subscribe(
      (data: Course[]) => {
        this.courses = data;
        this.loading = false;
      },
      (error: any) => {
        this.error = 'Error fetching courses';
        this.loading = false;
        console.error(this.error, error);
      }
    );
  }
  enrollCourse(staffId: string, courseId: number): void {
    this.studentService.enrollCourse(staffId, courseId).subscribe(
      response => {
        console.log('Enrollment successful', response);
        this.router.navigate(['/student/mycourses']);
      },
      error => {
        console.error('Enrollment failed', error);
      }
    );
  }
}
