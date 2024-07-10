import { Component } from '@angular/core';

interface Contact {
  name: string;
  status: string;
  avatarUrl: string;
}

interface GroupChat {
  name: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-student-msg-sidebar',
  templateUrl: './student-msg-sidebar.component.html',
  styleUrls: ['./student-msg-sidebar.component.css']
})
export class StudentMsgSidebarComponent {
  currentUser: string = 'John Doe'; 

  contacts: Contact[] = [
    { name: 'Jane Smith', status: 'Online', avatarUrl: 'https://via.placeholder.com/50' },
    { name: 'Michael Johnson', status: 'Offline', avatarUrl: 'https://via.placeholder.com/50' },

  ];

  groupChats: GroupChat[] = [
    { name: 'Group Chat 1', avatarUrl: 'https://via.placeholder.com/50' },
    { name: 'Group Chat 2', avatarUrl: 'https://via.placeholder.com/50' },

  ];

  constructor() {}
}
