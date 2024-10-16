// notification.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../../admin/notification/notification.component';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private dialog: MatDialog) { }

  openNotificationDialog() {
    this.dialog.open(NotificationComponent, {
      width: '400px', // adjust width as needed
      autoFocus: false, // ensure focus is not automatically set inside the dialog
    });
  }
}
