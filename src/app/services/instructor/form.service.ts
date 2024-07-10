import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamModel } from '../../models/instructor/exam.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:8080'; // Base URL

  constructor(private http: HttpClient) { }

  addExam(exam: any, courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exam?courseId=${courseId}`, exam);
  }

  addQuestion(question: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/question`, question);
  }

  addOption(option: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/option`, option);
  }
}
