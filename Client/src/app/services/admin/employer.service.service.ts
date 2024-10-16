import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employer } from '../../models/admin/employer';
import { ApproveModel } from '../../models/admin/ApprovedModel';
import { MonthlyCourseEnrollmentModel } from '../../models/charts/MonthlyCourseEnrollmentModel';
import { AmountOfAccount } from '../../models/admin/amountModel';

@Injectable({
  providedIn: 'root'
})
export class EmployerServiceService {
  private baseURL = "http://localhost:8080/admin";
  constructor(private httpClient: HttpClient) { }

  getEmployerList(): Observable<Employer[]>{
    return this.httpClient.get<Employer[]>(`${this.baseURL}/employerlist`);
  }
  getEmployerStudentList(): Observable<Employer[]>{
    return this.httpClient.get<Employer[]>(`${this.baseURL}/studentlist`);
  }
  getAmountOfAccount(): Observable<AmountOfAccount>{
    return this.httpClient.get<AmountOfAccount>(`${this.baseURL}/amountOfAccount`);
  }
  getEmployerByStaffId(staffId: string): Observable<Employer>{
    return this.httpClient.get<Employer>(`${this.baseURL}/profile/${staffId}`);
  }
  updateEmployerRole(staffId: string, employer: Employer): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/updateEmployer/${staffId}`, employer);
  }
  updateEmployer(sr: number, employer: Employer): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/updateEmployerInformation/${sr}`, employer);
  }
  changeEmployerPermission(staffId: string, employer: Employer): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/permission/${staffId}`, employer);
  }
  approvedCourse(approveModel: ApproveModel): Observable<Object>{
    return this.httpClient.put(`${this.baseURL}/courseApproved`, approveModel);
  }
  getEmployerByDbId(staffId: number): Observable<Employer>{
    return this.httpClient.get<Employer>(`${this.baseURL}/getInstructorInfromation/${staffId}`);
  }


  getMonthlyEnrollments(year: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/monthly/${year}`);
  }
  getCourseAttendanceData(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseURL);
  }
  checkExamHasCourse(courseId: string): Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.baseURL}/checkExamHasCourse/${courseId}`);
  }
}
