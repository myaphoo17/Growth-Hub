import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private apiUrl = 'http://localhost:8080'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  getExamById(examId: number): Observable<any> {
    return this.http.get(${this.apiUrl}/exam/${examId});
  }

  submitExamAnswers(examId: number, studentId: number, answers: any[]): Observable<any> {
    const payload = { studentId, answers };
    return this.http.post(${this.apiUrl}/student_exam/${examId}/submit, payload);
  }

  getExamResults(examId: number, studentId: number): Observable<any> {
    return this.http.get(${this.apiUrl}/student_exam/${examId}/results/${studentId});
  }
}