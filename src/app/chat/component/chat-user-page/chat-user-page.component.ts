import { Component, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../model/UserResponse';
import { MessagServiceService } from '../../service/messag-service.service';
import { WebSocketService } from '../../service/web-socket.service';
import { UserService } from '../../service/user.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-chat-user-page',
  templateUrl: './chat-user-page.component.html',
  styleUrls: ['./chat-user-page.component.css']
})
export class ChatUserPageComponent implements OnInit, OnDestroy {
  userDetails: UserResponse = new UserResponse();
  emailProfile!: string;
  staffIdProfile!: string;
  userNameProfile!: string;
  profileImageProfile!: string;
  allMessage: any = [];
  content = '';
  length = 0;
  loginUser!: string;
  isLoading = true;
  isSending = false;
  private subscriptions: Subscription[] = [];
  private refreshSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private messageService: MessagServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private webSocketService: WebSocketService,
    private elementRef: ElementRef
  ) {
    this.loginUser = sessionStorage.getItem('userId') || '';
    this.getUserDetails();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const encodedId = params.get('staffId');
      this.staffIdProfile = encodedId ? Base64.decode(encodedId) : '';
      this.getUserDetailsByUser();
    });

    setTimeout(() => {
      this.scrollToLastElement();
    }, 500);

    this.webSocketService.onConnect2(this.loginUser).subscribe(response => {
      const allMessages = document.getElementById("allMessages");
      if (allMessages) {
        allMessages.innerHTML += `
          <div>
            <div class="flex w-full mt-2 space-x-3 max-w-xs">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                <img class="w-10 h-10 rounded-full" src="${this.profileImageProfile}" alt="Rounded avatar">
              </div>
              <div>
                <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                  <p class="text-sm break-all">${response.content}</p>
                </div>
                <span class="text-xs text-gray-500 leading-none">${this.timeGenerator(response.createdAt)}</span>
              </div>
            </div>
          </div>`;
      }
    });

    this.refreshSubscription = interval(10000).pipe(
      switchMap(() => this.messageService.getMessaageBySenderReciver(this.userDetails.body.staffId, this.staffIdProfile))
    ).subscribe(response => {
      this.allMessage = response.body;
    }, error => {
      console.error('Error fetching private messages:', error);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getUserDetails() {
    this.userService.getUserByStaffId(this.loginUser).subscribe(
      (userData) => {
        this.userDetails.body = userData;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getUserDetailsByUser() {
    if (this.staffIdProfile) {
      this.userService.getUserByStaffId(this.staffIdProfile).subscribe(
        (response) => {
          if (response) {
            this.staffIdProfile = response.staffId;
            this.userNameProfile = response.name;
            this.profileImageProfile = response.profilePhotoUrl;
            this.getPrivateMessages();
          } else {
            console.error('Invalid response format:', response);
          }
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('staffIdProfile is undefined');
    }
  }

  sendPrivateMessage() {
    const allMessages = document.getElementById("allMessages");
    const date: Date = new Date();
    if (this.content.trim() !== '') {
      this.isSending = true;
      try {
        this.webSocketService.sendPrivateMessage(this.userDetails.body.staffId, this.staffIdProfile, this.content, 'CHAT');
        if (allMessages) {
          allMessages.innerHTML += `
            <div>
              <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                <div>
                  <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                    <p class="text-sm break-all">${this.content}</p>
                  </div>
                  <span class="text-xs text-gray-500 leading-none">${this.timeGenerator(date.getTime())}</span>
                </div>
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                  <img class="w-10 h-10 rounded-full" src="${this.userDetails.body.profilePhotoUrl}" alt="Rounded avatar">
                </div>
              </div>
            </div>`;
          this.content = '';
          this.length = 0;
          setTimeout(() => {
            this.scrollToLastElement();
          }, 100);
          setTimeout(() => {
            this.webSocketService.sendMessageNotif(this.staffIdProfile, 'send Message');
          }, 100);
        }
        this.isSending = false;
      } catch (error) {
        console.error('Error sending message:', error);
        this.isSending = false;
      }
    }
  }

  getPrivateMessages() {
    this.messageService.getMessaageBySenderReciver(this.userDetails.body.staffId, this.staffIdProfile).subscribe(
      (response) => {
        this.allMessage = response.body;
      },
      (error) => {
        console.error('Error fetching private messages:', error);
      }
    );
  }

  scrollToLastElement() {
    const container = this.elementRef.nativeElement.querySelector('#allMessages');
    if (container) {
      const lastElement = container.lastElementChild;
      if (lastElement) {
        lastElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onWrite(event: KeyboardEvent) {
    let regex = /^[a-zA-Z0-9]$/;
    if ((regex.test(event.key) && this.length < 250) || (event.key === " " && this.length < 100)) {
      this.length++;
    } else if (event.key === "Backspace" && this.content.length > 0) {
      this.length--;
    } else {
      event.preventDefault();
    }
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

  checkIfSenderorReciever(idSender: string) {
    return idSender === this.loginUser;
  }
}
