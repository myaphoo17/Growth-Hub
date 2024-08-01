import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employer } from '../../models/instructor/employer';
import { Education } from '../../models/instructor/education.model';
import { StdentCourseModel } from '../../models/student/StudentCourseModel';
import { CourseModel } from '../../models/instructor/courseModel';
import { UploadFiles } from '../../models/instructor/UploadFiles';
@Injectable({
  providedIn: 'root',
})
export class StudentprofileService {
  private baseURL = 'http://localhost:8080/student';
  private apiUrl = 'http://localhost:8080/student/unenrollCourse'; // Adjust the URL as needed


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


  unenrollCourse(staffId: string, courseId: number): Observable<any> {
    const url = `${this.apiUrl}/${staffId}/${courseId}`;
    return this.httpClient.post(url, {});
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
  enrollCourse(staffId: string, courseId: string): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/enrollCourse/${staffId}/${courseId}`, {});
}
getEnrollCourses(staffId: string): Observable<StdentCourseModel[]> {
  return this.httpClient.get<StdentCourseModel[]>(`${this.baseURL}/enrollCourses/${staffId}`);
}


getEnrollCoursesview(staffId: string): Observable<CourseModel[]> {
  return this.httpClient.get<CourseModel[]>(`${this.baseURL}/enrollCourses/${staffId}`);
}
getCourseDetailsById(courseId: string): Observable<CourseModel> {
  return this.httpClient.get<CourseModel>(`${this.baseURL}/getCourseById/${courseId}`);
}
checkEmployeeExists(courseId: string,staffId:string): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.baseURL}/exists/${courseId}/${staffId}`);
}
// In studentprofile.service.ts
getEnrollmentCount(courseId: string): Observable<number> {
  return this.httpClient.get<number>(`${this.baseURL}/course_count/${courseId}`);
}
markAsCompleted(id: number, completed: boolean): Observable<UploadFiles> {
  return this.httpClient.put<UploadFiles>(`${this.baseURL}/${id}/complete`, {}, {
    params: { completed: completed.toString() }
  });
}
getVideosByCourseId(courseId: number): Observable<UploadFiles[]> {
  return this.httpClient.get<UploadFiles[]>(`${this.baseURL}/course/${courseId}`);
}
getCourseListById(courseId: string): Observable<UploadFiles[]> {
  return this.httpClient.get<UploadFiles[]>(`${this.baseURL}/course/${courseId}`);
}

}
