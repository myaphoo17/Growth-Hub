import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employer } from '../../models/admin/employer';
import { StudentprofileService } from '../../services/student/studentprofile.service';

// interface Notification {
//   message: string;
// }

// interface ForumPost {
//   title: string;
// }

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent implements OnInit {
  userId: string = sessionStorage.getItem('userId') || '';
  dbId: string = sessionStorage.getItem('dbId') || '';
  studentData: Employer = {} as Employer;

  isDropdownVisible = false;
  showNotifications = false;
  showForum = false;

  constructor(private studentService: StudentprofileService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.studentProfile();
  }

  studentProfile(): void {
    this.studentService.getStudentProfileById(this.userId).subscribe({
      next: (data: Employer) => {
        if (data) {
          this.studentData = data;
          this.cdr.detectChanges(); // Ensure change detection runs
        }
      },
      error: (e: any) => console.error(e),
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showForum = false;
    this.cdr.detectChanges();
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
    this.cdr.detectChanges();
  }

  toggleForum() {
    this.showForum = !this.showForum;
    this.showNotifications = false;
    this.cdr.detectChanges();
  }

  // notifications: Notification[] = [
  //   { message: 'New assignment available.' },
  //   { message: 'Course updated.' },
  //   { message: 'New message from instructor.' }
  // ];

  // forumPosts: ForumPost[] = [
  //   { title: 'Discussion on Angular Best Practices' },
  //   { title: 'New Features in Angular 12' },
  //   { title: 'How to Improve Your Coding Skills' }
  // ];
}
