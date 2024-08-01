import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamModel } from '../../models/instructor/exam.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:8080'; // Base URL

  constructor(private http: HttpClient) {}

  addExam(exam: any, courseId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exam?courseId=${courseId}, exam`, { responseType: 'text' as 'json' });
  }

  getExamDetailsByCourseId(courseId: number): Observable<ExamModel> {
    return this.http.get<ExamModel>(`${this.apiUrl}/exam/course/${courseId}`);
  }

  addQuestion(question: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/question`, question);
  }

  addOption(option: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/option`, option);
  }

  updateExam(courseId: number, examModel: ExamModel): Observable<ExamModel> {
    return this.http.put<ExamModel>(`${this.apiUrl}/exam/update/${courseId}`, examModel);
  }
}
