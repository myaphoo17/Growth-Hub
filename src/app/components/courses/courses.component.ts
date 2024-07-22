import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/courses';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as Base64 from 'js-base64';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading: boolean = true;
  error: string | null = null;
  staffId: string = sessionStorage.getItem('userId') || '';
  
  constructor(
    private coursesService: CoursesService,
    private studentService: StudentprofileService,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('categoryId');
      this.fetchCourses(categoryId ? +categoryId : undefined);
    });
    this.fetchCourses();
  }

  fetchCourses(categoryId?: number) {
    this.coursesService.getAllCourses().subscribe(
      (data: Course[]) => {
        if (categoryId !== undefined) {
          this.filteredCourses = data.filter(course => course.categoriesDTO.id === categoryId);
        } else {
          this.filteredCourses = data;
        }
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to fetch courses';
        this.loading = false;
        
      }
    );
  }

  onCategorySelect(categoryId: number): void {
    this.router.navigate(['instructor/int-home', categoryId]);
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

  encodeId(id: number): string {
    return Base64.encode(String(id));
  }
}
