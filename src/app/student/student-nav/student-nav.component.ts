import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private studentService: StudentprofileService, 
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthServiceService,
    private router: Router,
    private userServ: UserService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {
    this.loginUser = sessionStorage.getItem('userId') || '';
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  ngOnInit() {
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
