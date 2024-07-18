import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/courses';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:8080/courses/getAllCourses';
  private baseUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/search`, { params: { query } });
  }
}
