import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../models/instructor/courseModel';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:8080/instructor/courseList';
  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(this.apiUrl);
  }
}
