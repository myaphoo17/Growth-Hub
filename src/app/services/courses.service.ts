import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/courses';
import { Category } from '../models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:8080/courses/getAllCourses';
  private baseUrl = 'http://localhost:8080';
  private categoriesUrl = 'http://localhost:8080/courses/categories';


  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }
  
  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses/search`, { params: { query } });
  }
  
  getCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${courseId}`);
  }
  
  
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/courses/categories`);
  }
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }
}
