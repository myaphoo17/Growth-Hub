import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GradeModel } from '../../models/instructor/grade.model';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private baseUrl = 'http://localhost:8080'; // Adjust base URL as per your backend

  constructor(private http: HttpClient) { }

  saveGrades(grades: GradeModel[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/grades/saveGrade`, grades);
  }

  getGradesByCourseId(courseId: number): Observable<GradeModel[]> {
    return this.http.get<GradeModel[]>(`${this.baseUrl}/grades/grade/${courseId}`);
  }

  saveAndUpdateGrades(courseId: number, grades: GradeModel[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/grades/saveAndUpdate/${courseId}`, grades);
  }


  
}
