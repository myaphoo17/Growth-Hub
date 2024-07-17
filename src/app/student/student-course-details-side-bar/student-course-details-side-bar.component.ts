import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selectedItem: string = 'Module 1';  staffId: string = sessionStorage.getItem('userId') || '';

  courses: StdentCourseModel[] = [];
  ngOnInit() {
    this.getCourses();
    
  }
  constructor(private router: Router,private studentService: StudentprofileService) {}
  encodeId(id: string): string {
    return Base64.encode(id);
  }
  private getCourses(): void {
    this.studentService.getEnrollCourses(this.staffId).subscribe({
      next: (data) => {
        this.courses = data;
        this.courses.forEach(course => {
          course.uploadFilesDTO = course.uploadFilesDTO || []; // Initialize files if undefined
          course.categoriesDTO = course.categoriesDTO || { name: '' }; 
          course.title= course.title// Initialize category if undefined
        });
        this.updatePagedCards();
      },
      error: (e) => console.error(e),
    });
  }
  updatePagedCards() {
    throw new Error('Method not implemented.');
  }
  selectItem(item: string): void {
    this.selectedItem = item;
    if (item === 'Grades') {
      this.router.navigate(['/grades']);
    }
  } 
}
