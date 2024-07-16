import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../../security/services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class MessagServiceService {
  private url = 'http://localhost:8080/chatMessage';
  
  headers = new HttpHeaders({
    'Content-Type':'application/json',
    'Authorization':'Bearer '+inject(AuthServiceService).getToken()
   });
  constructor(private http: HttpClient) { }

  getMessaageBySenderReciver(senderStaffId:string,recipientStaffId:string):Observable<any>{
      const chatDto={
        senderStaffId:senderStaffId,
        recipientStaffId:recipientStaffId
      }
    return this.http.post<any>(`${this.url}/getChat`, chatDto,{headers:this.headers});
  }
}
