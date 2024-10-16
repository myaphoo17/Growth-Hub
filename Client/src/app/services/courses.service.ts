import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseModel } from '../models/instructor/courseModel';

import { Course } from '../models/courses';
import { Category } from '../models/category.model';



@Injectable({
  providedIn: 'root'
})
export class CoursesService {


  private apiUrl = 'http://localhost:8080/instructor/courseList';

  private baseUrl = 'http://localhost:8080';
  private categoriesUrl = 'http://localhost:8080/courses/categories';


  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<CourseModel[]> {
    return this.http.get<CourseModel[]>(this.apiUrl);
  }
  getAllCoursesCategory(): Observable<Course[]> {
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


  findCourses(courseName?: string, creatorId?: string, createdDate?: string, enrolledCount?: string): Observable<Course[]> {
    let params = new HttpParams();
    if (courseName) params = params.set('courseName', courseName);
    if (creatorId) params = params.set('creatorId', creatorId);
    if (createdDate) params = params.set('createdDate', createdDate);
    if (enrolledCount) params = params.set('enrolledCount', enrolledCount);

    return this.http.get<Course[]>(`${this.baseUrl}/courses/find`, { params });
  }
  
}


