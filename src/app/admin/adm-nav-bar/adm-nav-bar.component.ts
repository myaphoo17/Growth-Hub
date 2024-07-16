import { Component, Input, OnInit } from '@angular/core';
import { AuthServiceService } from '../../security/services/auth-service.service';
import { Router } from '@angular/router';
import { UserService } from '../../chat/service/user.service';
import { WebSocketService } from '../../chat/service/web-socket.service';
import { NotificationService } from '../../chat/service/notification.service';
import { UserResponse } from '../../chat/model/UserResponse';
import { Base64 } from 'js-base64';

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
  selector: 'app-adm-nav-bar',
  templateUrl: './adm-nav-bar.component.html',
  styleUrls: ['./adm-nav-bar.component.css']
})
export class AdmNavBarComponent implements OnInit {
  @Input() cards: Card[] = [];
  searchText: string = '';
  filteredCards: Card[] = [];
  loginUser!: string;
  loginUserDbid!: string;
  isHiddenNotif = true;
  isAllRead = false;
  userDetails: UserResponse = new UserResponse;
  dataSearch: Array<{ email: string, firstName: string, lastName: string }> = [];
  notifications: any;

  constructor(
    private authenticationService: AuthServiceService,
    private router: Router,
    private userServ: UserService,
    private webSocketService: WebSocketService,
    private notificationService: NotificationService
  ) {
    this.loginUserDbid = sessionStorage.getItem('dbId') || '';
    this.loginUser = sessionStorage.getItem('userId') || '';
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  ngOnInit() {
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
      this.isAllRead = this.notifications.some((notif: any) => !notif.isRead);
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

  isCourseCreate(type: string) {
    return type === "COURSECREATE";
  }

  isRead(read: boolean) {
    return read === true;
  }

  dropDownMenueNotif() {
    this.isHiddenNotif = !this.isHiddenNotif;
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

  timeGenerator(date: number) {
    const previousTime = new Date(date);
    const currentTime = new Date();
    const timeDifferenceInSeconds = Math.floor((currentTime.getTime() - previousTime.getTime()) / 1000);
    
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds} seconds ago`;
    }
    if (timeDifferenceInSeconds < 3600) {
      const minutes = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutes} minutes ago`;
    }
    if (timeDifferenceInSeconds < 86400) {
      const hours = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hours} hours ago`;
    }
    if (timeDifferenceInSeconds < 2592000) {
      const days = Math.floor(timeDifferenceInSeconds / 86400);
      return `${days} days ago`;
    }
    const months = Math.floor(timeDifferenceInSeconds / 2592000);
    return `${months} months ago`;
  }

  navigateToProfilePage(staffId: string, idPost: number, idRecepeintto: string, idUserFrom: string, type: string) {
    if (staffId) {
      if (type === "COURSECREATE") {
        this.router.navigate(['admin/adm-home/fact-check/fact-check-detail', this.encodeId(idPost.toString())]);
        this.funcRead( idRecepeintto,idUserFrom, type, idPost);
        setTimeout(() => {
          location.reload();
        }, 50);
      } else {
        this.router.navigate(['admin/privateChat', this.encodeId(staffId)]);
        this.funcRead(idRecepeintto, idUserFrom, type, idPost);
        setTimeout(() => {
          location.reload();
        }, 50);
      }
    }
  }

  logout() {
   
    this.authenticationService.logout();
    this.webSocketService.disconnect();
    this.router.navigate(['/login']);
  }
}
