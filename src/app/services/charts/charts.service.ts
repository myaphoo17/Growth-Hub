import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employer } from '../../models/admin/employer';
import { ApproveModel } from '../../models/admin/ApprovedModel';
import { MonthlyCourseEnrollmentModel } from '../../models/charts/MonthlyCourseEnrollmentModel';
import { MonthlyDataModel } from '../../models/charts/MonthlyDataModel';

@Injectable({
  providedIn: 'root'
})
export class ChartsServices {
  private baseURL = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) { }

  getMonthlyEnrollments(year: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/monthly/${year}`);
  }
  getMonthlyCourseAttendance(year: number): Observable<MonthlyCourseEnrollmentModel[]> {
    return this.httpClient.get<MonthlyCourseEnrollmentModel[]>(`${this.baseURL}/monthly/${year}`);
  }
 
  getMonthlyData(year: number): Observable<MonthlyDataModel[]> {
    return this.httpClient.get<MonthlyDataModel[]>(`${this.baseURL}/monthly-data/${year}`);
  }

}
