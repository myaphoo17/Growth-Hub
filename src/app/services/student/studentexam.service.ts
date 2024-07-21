
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamModel } from '../../models/instructor/exam.model';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private apiUrl = 'http://localhost:8080'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  // getExamDetailsByCourseId(courseId: number): Observable<ExamModel> {
  //   return this.http.get<ExamModel>(`${this.apiUrl}/exam/course/${courseId}`);
  // }

  // submitExamAnswers(examId: number, staffId: string, answers: any[]): Observable<any> {
  //   const payload = { staffId, answers };
  //   return this.http.post(`${this.apiUrl}/student_exam/${examId}/submit`, payload);
  // }

  submitExamAnswers(examId: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/student_exam/${examId}/submit`, payload);
  }
  
  

  getExamResults(examId: number, staffId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student_exam/${examId}/results/${staffId}`);
  }
}
