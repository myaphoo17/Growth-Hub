import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-course-details-side-bar',
  templateUrl: './student-course-details-side-bar.component.html',
  styleUrls: ['./student-course-details-side-bar.component.css']
})
export class StudentCourseDetailsSideBarComponent {
  modules = ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5', 'Module 6'];
  selectedItem: string = 'Module 1';

  constructor(private router: Router) {}

  selectItem(item: string): void {
    this.selectedItem = item;
    if (item === 'Grades') {
      this.router.navigate(['/grades']);
    }
  } 
}
