import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-student-messaging',
  templateUrl: './student-messaging.component.html',
  styleUrls: ['./student-messaging.component.css']
})
export class StudentMessagingComponent {
  currentUser: string = 'Student A'; // Replace with actual user name or ID
  messages: Message[] = [
    { sender: 'Student A', content: 'Hi there! How can I help you?', timestamp: '12:00 PM' },
    { sender: 'Student B', content: 'Hi! I need help with the assignment.', timestamp: '12:02 PM' },
    { sender: 'Instructor', content: 'Reminder: Project deadline is Friday.', timestamp: '1:00 PM' },
    // Additional sample messages
  ];
  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      newMessage: ['', Validators.required]
    });
  }

  sendMessage() {
    if (this.messageForm.valid) {
      const newMessage = this.messageForm.value.newMessage.trim();
      if (newMessage !== '') {
        this.messages.push({
          sender: this.currentUser,
          content: newMessage,
          timestamp: new Date().toLocaleTimeString()
        });
        this.messageForm.reset(); // Clear input after sending
      }
    }
  }
}
