import { Component, Input, OnInit, ChangeDetectorRef  } from '@angular/core';
import { UserResponse } from '../../chat/model/UserResponse';
import { AuthServiceService } from '../../security/services/auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../chat/service/user.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { NotificationService } from '../../chat/service/notification.service';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employer } from '../../models/admin/employer';
import { FormControl } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CoursesService } from '../../services/courses.service';
import { HttpClient } from '@angular/common/http';

interface Card {
  title: string;
  subtitle: string;
  image: string;
  content: string;
  showMore: boolean;
  showDetails: boolean;
  updated: string;
  details: string;
  features: string[];
}

@Component({
  selector: 'app-int-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class IntstructorNavBarComponent implements OnInit {
  @Input() cards: Card[] = [];
  searchText: string = '';
  filteredCards: Card[] = [];
  userId: string | null = sessionStorage.getItem('userId');
  loginUser!: string;
  isHiddenNotif = true;
  isAllRead = false;
  userDetails: UserResponse = new UserResponse();
  dataSearch: Array<{ email: string, firstName: string, lastName: string }> = [];
  notifications: any;
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
  isDropdownVisible = false;
  showNotifications = false;
  showForum = false;

  query: string = '';
  searchResults: any[] = [];
  showDropdown: boolean = false;

  constructor(
    private authenticationService: AuthServiceService,
    private router: Router,
    private userServ: UserService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private coursesService: CoursesService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.loginUser = sessionStorage.getItem('userId') || '';
  }

  ngOnInit() {
    this.fetchCategories();
    this.isAdmin = this.role === 'Admin';
    this.isInstructor = this.role === 'Instructor';
    this.isStudent = this.role === 'Student';
    this.getEmployers();
    this.filteredCards = this.cards;
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
  navigateToProfileViewPage(staffId:string) {
    this.router.navigate(['/instructor/profile-view', this.encodeId(staffId)]).then(()=>{
      location.reload()
    });
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

  encodeId(id: string): string {
    return Base64.encode(id);
  }
  fetchCategories(): void {
    this.coursesService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }


  onCategorySelect(categoryId: number) {
    this.router.navigate(['instructor/int-home',  categoryId]);
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

  navigateToCourseDetails(courseId: number, courseTitle: string) {
    this.stringCourseId=courseId.toString();
    this.query = courseTitle;
    this.router.navigate(['/instructor/course-details', this.encodeId(this.stringCourseId)], { queryParams: { searchQuery: this.query } });
    this.showDropdown = false;
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

  isEnroll(type: string) {
    return type === "ENROLL";
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

  filterCards() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredCards = this.cards.filter(card =>
      card.title.toLowerCase().includes(searchLower) ||
      card.subtitle.toLowerCase().includes(searchLower) ||
      card.content.toLowerCase().includes(searchLower)
    );
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
      if(type=="ENROLL"){
        this.router.navigate(['instructor/course-details', this.encodeId(idPost.toString())]);
        this.funcRead(idRecepeintto,idUserFrom,type,idPost);
        }
      this.router.navigate(['instructor/privateChat', this.encodeId(staffId)]);
      this.funcRead(idRecepeintto, idUserFrom, type, idPost);
     
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
