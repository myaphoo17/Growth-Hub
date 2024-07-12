import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employer } from '../../models/instructor/employer';
import { Education } from '../../models/instructor/education.model';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
@Injectable({
  providedIn: 'root',
})
export class StudentprofileService {
  private baseURL = 'http://localhost:8080/student';

  constructor(private httpClient: HttpClient) {}

  getStudentProfileById(staffId: string): Observable<Employer> {
    return this.httpClient.get<Employer>(`${this.baseURL}/profile/${staffId}`);
  }

  updateStudentInfo(staffId: string, employer: Employer): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/updateInformation/${staffId}`, employer);
  }

  addEducation(dbId: string, education: Education): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/addEducation/${dbId}`, education);
  }

  getEducations(dbId: string): Observable<Education[]> {
    return this.httpClient.get<Education[]>(`${this.baseURL}/getEducations/${dbId}`);
  }

  updateEducation(id: string, education: Education): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/updateEducation/${id}`, education);
  }

  getEducationById(id: string): Observable<Education> {
    return this.httpClient.get<Education>(`${this.baseURL}/education/${id}`);
  }

  deleteEducation(educationId: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/deleteEducation/${educationId}`);
  }
  enrollCourse(staffId: string, courseId: number): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/enrollCourse/${staffId}/${courseId}`, {});
}
getEnrollCourses(staffId: string): Observable<StdentCourseModel[]> {
  return this.httpClient.get<StdentCourseModel[]>(`${this.baseURL}/enrollCourses/${staffId}`);
}

getCourseById(courseId: string): Observable<StdentCourseModel> {
  return this.httpClient.get<StdentCourseModel>(`${this.baseURL}/courseListById/${courseId}`);
}
}
