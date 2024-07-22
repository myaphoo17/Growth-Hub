import { Component, Input, OnInit, ChangeDetectorRef  } from '@angular/core';
import { UserResponse } from '../../chat/model/UserResponse';
import { AuthServiceService } from '../../security/services/auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../chat/service/user.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { NotificationService } from '../../chat/service/notification.service';
import { Base64 } from 'js-base64';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../models/courses';
import { Category } from '../../models/category.model';
import { FormControl } from '@angular/forms';
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
  isHiddenNotif=true;
  isAllRead=false;
  userDetails: UserResponse = new UserResponse;
  dataSearch: Array<{ email: string,firstName:string,lastName:string }> = [];
  notifications:any;

  searchControl = new FormControl();
  categories: Category[] = [];
  filteredCategory: Category[] = [];

  isDropdownVisible = false;
  showNotifications = false;
  showForum = false;

  query: string = '';
  searchResults: any[] = [];
  showDropdown: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private authenticationService:AuthServiceService,
    private router: Router,
    private userServ:UserService,
    private webSocketService:WebSocketService,
    private notificationService :NotificationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,)
    {
    this.loginUser = sessionStorage.getItem('userId') || '';
   
  }
  
  ngOnInit() {
    this.fetchCategories();
    this.filteredCards = this.cards;
        this.getUserDetails();
    // this.findAllUsers();
    this.webSocketService.connect();
    setTimeout(() => {
      this.webSocketService.onConnectNotif(this.loginUser).subscribe(response=>{
        if (response.content=="updateRole") {
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
    this.query = courseTitle;
    this.router.navigate(['/instructor/int-home/card_detail', courseId], { queryParams: { searchQuery: this.query } });
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
  // findAllUsers(){
  //   this.userServ.findAllUsers().subscribe(response=>{
  //     this.dataSearch=response.body;
    
  //   });
  // }
  
  showNotification(){
    this.notificationService.showPostAndUserDetails(this.loginUser).subscribe((response)=>{
      this.notifications=response.body;
      let i=0
      this.notifications.forEach(() => {
        if (this.notifications[i].isRead==false) {
          this.isAllRead=true;
        }
        i++;
      });
    })
  }
  isMessage(type:string){
    return type==="MESSAGE"
  }
  isComment(type:string){
    return type==="COMMENT"
  }
  isLike(type:string){
    return type==="LIKE"
  }
  isFollow(type:string){
    return type==="FOLLOW"
  }
  isCourseCreate(type: string) {
    return type === "COURSECREATE";
  }
  isRead(read:boolean){
      return read==true
  }

  dropDownMenueNotif(){
    if (this.isHiddenNotif==true) {
      this.isHiddenNotif=false;
      return;
    }
    
    this.isHiddenNotif=true;
   
  }
 
  funcRead(staffIdUserTo: string, staffIdUserFrom: string, type: string, idPost: number) {
    this.notificationService.funcRead( staffIdUserTo,staffIdUserFrom, type, idPost).subscribe();
  }

  filterCards() {
    const searchLower = this.searchText.toLowerCase();
    this.filteredCards = this.cards.filter(card =>
      card.title.toLowerCase().includes(searchLower) ||
      card.subtitle.toLowerCase().includes(searchLower) ||
      card.content.toLowerCase().includes(searchLower)
    );
  }

  timeGenerator(date:number){
    const previousTime= new Date(date)
    const currentTime = new Date();
      const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - previousTime.getTime()) / 1000);
      if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} seconds ago`;
      }if (timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutes} minutes ago`;
      } if (timeDifferenceInSeconds < 86400) {
        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        return  `${hours} hours ago`;
      } if (timeDifferenceInSeconds < 2592000) {
        const days = Math.floor(timeDifferenceInSeconds / 86400);
        return `${days} days ago`;
      }  
        const months = Math.floor(timeDifferenceInSeconds / 2592000);
        return `${months} months ago`;
  }

  navigateToProfilePage(staffId: string, idPost: number, idRecepeintto: string, idUserFrom: string, type: string) {   
    if (staffId!=null) {
     
      // this.router.navigate(['profile', staffId]);
      //       this.funcRead(idUserFrom,idRecepeint,type,idPost);
      //       setTimeout(() => {
      //         location.reload()
      //       }, 50);
      //       return;
      // }
      this.router.navigate(['instructor/privateChat',  this.encodeId(staffId)]);
      this.funcRead(idRecepeintto, idUserFrom, type, idPost);
      setTimeout(() => {
        location.reload();
      }, 50);
    }
  }
    //  this.router.navigate(['post', idPost]);
    //  this.funcRead(idUserFrom,idRecepeint,type,idPost);
    //  setTimeout(() => {
    //   location.reload()
    //  }, 50);
     
  
    logout() {
      this.authenticationService.logout();
      this.webSocketService.disconnect();
      this.router.navigate(['/login']);
    }

    
}
