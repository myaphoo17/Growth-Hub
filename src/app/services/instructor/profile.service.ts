import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employer } from '../../models/instructor/employer';
import { Education } from '../../models/instructor/education.model';
import { ObjectModel } from '../../models/instructor/objectModel';
import { CourseModel } from '../../models/instructor/courseModel';
import { UploadFiles } from '../../models/instructor/UploadFiles';
import { EditEducationModel } from '../../models/instructor/EditVideoFileModel';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseURL = "http://localhost:8080/instructor";

  constructor(private httpClient: HttpClient) {}

  getInstructorProfileById(staffId: string): Observable<Employer> {
    return this.httpClient.get<Employer>(`${this.baseURL}/profile/${staffId}`);
  }

  updateInstructorInfo(staffId: string, employer: Employer): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/updateInformation/${staffId}`, employer);
  }

  addEducation(dbId: string, education: Education): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/addEducation/${dbId}`, education);
  }

  getEducations(dbId: string): Observable<Education[]> {
    return this.httpClient.get<Education[]>(`${this.baseURL}/getEducations/${dbId}`);
  }

  updateEducation(dbId: string, education: Education): Observable<Object> {
    return this.httpClient.put(`${this.baseURL}/updateEducation/${dbId}`, education);
  }

  getEducationById(id: string): Observable<Education> {
    return this.httpClient.get<Education>(`${this.baseURL}/education/${id}`);
  }

  deleteEducation(educationId: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/deleteEducation/${educationId}`);
  }

  uploadCourse(files: File[], fileNames: string[], object: ObjectModel): Observable<any> {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
      formData.append('fileNames', fileNames[i]);
    }
    formData.append('object', new Blob([JSON.stringify(object)], { type: 'application/json' }));
    return this.httpClient.post(`${this.baseURL}/addCourse`, formData, {
      headers: new HttpHeaders({
        'enctype': 'multipart/form-data'
      })
    });
  }

  getApprovedCourseList(employerId: string): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${this.baseURL}/getApprovedCourseByInstructor/${employerId}`);
  }

  getUnApprovedCourseListByEmployerId(employerId: string): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${this.baseURL}/getUnApprovedCourseByInstructor/${employerId}`);
  }

  getCourseListById(courseId: string): Observable<UploadFiles[]> {
    return this.httpClient.get<UploadFiles[]>(`${this.baseURL}/courseListById/${courseId}`);
  }

  deleteUploadFile(fileId: string): Observable<Object> {
    return this.httpClient.delete(`${this.baseURL}/deleteUploadFile/${fileId}`);
  }

  getUnApprovedCourseList(): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${this.baseURL}/unApprovedCourseList`);
  }
  checkEmployeeExists(courseId: string,staffId:string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseURL}/instructorExists/${courseId}/${staffId}`);
  }
}

