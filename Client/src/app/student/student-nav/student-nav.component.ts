import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { Employer } from '../../models/admin/employer';
import { StudentprofileService } from '../../services/student/studentprofile.service';
import { AuthServiceService } from '../../security/services/auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../chat/service/user.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { NotificationService } from '../../chat/service/notification.service';
import { UserResponse } from '../../chat/model/UserResponse';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Category } from '../../models/category.model';
import { HttpClient } from '@angular/common/http';
import { CoursesService } from '../../services/courses.service';

@Component({
  selector: 'app-student-nav',
  templateUrl: './student-nav.component.html',
  styleUrls: ['./student-nav.component.css']
})
export class StudentNavComponent implements OnInit {
  dbId: string = sessionStorage.getItem('dbId') || '';
  studentData: Employer = {} as Employer;
  
  loginUser!: string;
  isHiddenNotif = true;
  isAllRead = false;
  userDetails: UserResponse = new UserResponse();
  dataSearch: Array<{ email: string, firstName: string, lastName: string }> = [];
  notifications: any;
  isDropdownVisible = false;
  showNotifications = false;
  showForum = false;
  isHiddenChat= true;
  employers: Employer[] = [];
  check = sessionStorage.getItem('userId');
  isAdmin: boolean = false;
  isInstructor: boolean = false;
  isStudent: boolean = false;
  role=sessionStorage.getItem('role');
  searchTerm:string='';


  searchControl = new FormControl();
  categories: Category[] = [];
  filteredCategory: Category[] = [];
  stringCourseId!:string;
  query: string = '';
  searchResults: any[] = [];
  showDropdown: boolean = false;
  selectedCategoryName: string | null = null;

  constructor(
    private studentService: StudentprofileService, 
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthServiceService,
    private router: Router,
    private userServ: UserService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private eRef: ElementRef,

    private http: HttpClient,
    private coursesService: CoursesService
  ) {
    this.loginUser = sessionStorage.getItem('userId') || '';
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  ngOnInit() {
    this.fetchCategories();
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.getEmployers();
    this.studentProfile();
    this.getUserDetails();
    this.webSocketService.connect();
    setTimeout(() => {
      this.webSocketService.onConnectNotif(this.loginUser).subscribe(response => {
        if (response.content == "updateRole") {
          sessionStorage.clear();
          this.router.navigate(['login']);
          setTimeout(() => {
            location.reload();
          }, 50);
        }
        this.showNotification();
      });
    }, 900);
  }
  fetchCategories(): void {
    this.coursesService.getCategories().subscribe(
      (data: Category[]) => {
        const categoryMap = new Map<string, Category>();
        data.forEach(item => categoryMap.set(item.name, item));
        this.categories = Array.from(categoryMap.values());
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  onCategorySelect(categoryName: string): void {
    this.selectedCategoryName = categoryName;
    this.router.navigate(['student/stu-home',  categoryName]);
  }
  searchCourses() {
    if (this.query.trim().length === 0) {
      this.showDropdown = false;
      return;
    }

    this.http.get<any[]>(`http://localhost:8080/courses/search?title=${this.query}`).subscribe((data) => {
      this.searchResults = data;
      this.showDropdown = true;
      this.cdr.detectChanges(); // Ensure change detection runs
    });
  }
  navigateToProfileViewPage(staffId:string) {
    this.router.navigate(['/student/profile-view', this.encodeId(staffId)]).then(()=>{
      setTimeout(() => {
       
      }, 50);
    });
  }

  navigateToCourseDetails(courseId: number, courseTitle: string) {
    this.stringCourseId=courseId.toString();
    this.query = courseTitle;
    this.router.navigate(['/student/course-details', this.encodeId(this.stringCourseId)], { queryParams: { searchQuery: this.query } });
    this.showDropdown = false;
  }

  get filteredEmployers(): Employer[] {
    return this.employers.filter(user =>
      (user.name && user.name.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  private getEmployers(): void {
    this.userServ.getEmployerList().subscribe({
      next: (data) => {
        this.employers = data.filter(user => user.staffId !== this.check);
      },
      error: (e) => console.error(e),
    });
  }

  studentProfile(): void {
    this.studentService.getStudentProfileById(this.loginUser).subscribe({
      next: (data: Employer) => {
        if (data) {
          this.studentData = data;
          this.cdr.detectChanges(); // Ensure change detection runs
        }
      },
      error: (e: any) => console.error(e),
    });
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

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const clickedInsideChat = this.eRef.nativeElement.querySelector('#dropdownChat')?.contains(event.target as Node);
    const clickedInsideNotification = this.eRef.nativeElement.querySelector('#dropdownNotification')?.contains(event.target as Node);
    const clickedOnChatButton = (event.target as HTMLElement).closest('[data-dropdown-toggle="dropdownChat"]');
    const clickedOnNotifButton = (event.target as HTMLElement).closest('[data-dropdown-toggle="dropdownNotification"]');

    if (!clickedInsideChat && !clickedOnChatButton) {
      this.isHiddenChat = true;
    }

    if (!clickedInsideNotification && !clickedOnNotifButton) {
      this.isHiddenNotif = true;
    }
  }
  getUserDetails() {
    this.userServ.getUserByStaffId(this.loginUser).subscribe(
      (userData) => {
        this.userDetails.body = userData;
        this.showNotification();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  showNotification() {
    this.notificationService.showPostAndUserDetails(this.loginUser).subscribe((response) => {
      this.notifications = response.body;
      this.notifications.forEach((notification: any) => {
        if (!notification.isRead) {
          this.isAllRead = true;
        }
      });
    });
  }

  isMessage(type: string) {
    return type === "MESSAGE";
  }

  isComment(type: string) {
    return type === "COMMENT";
  }

  isLike(type: string) {
    return type === "LIKE";
  }

  isFollow(type: string) {
    return type === "FOLLOW";
  }

  isCourseCreate(type: string) {
    return type === "COURSECREATE";
  }

  isRead(read: boolean) {
    return read === true;
  }

  dropDownMenueNotif() {
    this.isHiddenNotif = !this.isHiddenNotif;
  }
  dropDownMenueChat() {
    this.isHiddenChat = !this.isHiddenChat;
  }

  closeChatDropdown() {
    this.isHiddenChat = true;
  }

  funcRead(staffIdUserTo: string, staffIdUserFrom: string, type: string, idPost: number) {
    this.notificationService.funcRead(staffIdUserTo, staffIdUserFrom, type, idPost).subscribe();
  }

  timeGenerator(date: number) {
    const previousTime = new Date(date);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - previousTime.getTime()) / 1000);

    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} seconds ago`;
    } else if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (timeDifferenceInSeconds < 2592000) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} days ago`;
    } else {
      const months = Math.floor(timeDifferenceInSeconds / 2592000);
      return `${months} months ago`;
    }
  }

  navigateToProfilePage(staffId: string, idPost: number, idRecepeintto: string, idUserFrom: string, type: string) {
    if (staffId != null) {
      this.router.navigate(['student/privateChat', this.encodeId(staffId)]);
      this.funcRead(idRecepeintto, idUserFrom, type, idPost);
      setTimeout(() => {
        location.reload();
      }, 50);
    }
  }

  logout() {
    this.authenticationService.logout(); // Clear authentication data
    this.webSocketService.disconnect(); // Disconnect WebSocket
    sessionStorage.clear(); // Clear session storage
    this.router.navigate(['/login']); // Navigate to login page
    this.snackBar.open('You have been logged out', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
