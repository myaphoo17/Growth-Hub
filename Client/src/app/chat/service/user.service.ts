import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { AuthServiceService } from '../../security/services/auth-service.service';
import { DecodeJwt } from '../model/DecodeJwtToken';
import { Employer } from '../model/employer';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:8080/user';

  constructor(private http: HttpClient, private authService: AuthServiceService) {}
 
  getUserByStaffId(staffId:string): Observable<any>{
    return this.http.get<any>(`${this.url}/staffId/` + staffId)
  }

  findAllUsers():Observable<any>{
    return this.http.get(`${this.url}/findAllUsers`);
  }

  getEmployerList(): Observable<Employer[]>{
    return this.http.get<Employer[]>(`${this.url}/employerlist`);
  }
}