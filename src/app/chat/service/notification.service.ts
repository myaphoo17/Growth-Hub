import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../security/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private url = 'http://localhost:8080/notification';
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthServiceService // Inject AuthServiceService here
  ) {
    // Initialize headers with token
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authService.getToken() // Retrieve token from AuthServiceService
    });
  }

  showPostAndUserDetails(staffId: string): Observable<any> {
    const user = {
      staffId: staffId
    };
    return this.http.post(`${this.url}/getNotification`, user, { headers: this.headers });
  }

  funcRead(staffIdUserTo: string, staffIdUserFrom: string, typeNotif: string, idPost: number): Observable<any> {
    const notif = {
      staffIdUserTo: staffIdUserTo,
      staffIdUserFrom: staffIdUserFrom,
      typeNotif: typeNotif,
      idPost: idPost
    };
    return this.http.post(`${this.url}/readNotification`, notif, { headers: this.headers });
  }
}
