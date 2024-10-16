import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Employer } from '../../models/instructor/employer';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private baseURL = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) { }

  getEmployerList(): Observable<Employer[]>{
    return this.httpClient.get<Employer[]>(`${this.baseURL}/employerlist`);
  }
  getEmployerByStaffId(staffId: string): Observable<Employer>{
    return this.httpClient.get<Employer>(`${this.baseURL}/profile/${staffId}`);
  }
  updateEmployerRole(staffId: string, employer: Employer): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/updateEmployer/${staffId}`, employer);
  }
  changeEmployerPermission(staffId: string, employer: Employer): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/permission/${staffId}`, employer);
  }
}
