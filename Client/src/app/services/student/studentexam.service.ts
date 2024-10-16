
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamModel } from '../../models/instructor/exam.model';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private apiUrl = 'http://localhost:8080'; 

  constructor(private http: HttpClient) { }

  getExamById(examId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/exam/${examId}`);
  }

  getExamResults(examId: number, staffId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student_exam/${examId}/results/${staffId}`);
  }

  getExamDetailsByCourseId(courseId: number): Observable<ExamModel> {
    return this.http.get<ExamModel>(`${this.apiUrl}/exam/course/${courseId}`);
  }
  
  getHasExamByCourseId(courseId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exam/hasExam/${courseId}`);
  }

  getStudentAnswersByCourseAndStaff(courseId: number, staffId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student_exam/student-answers/${courseId}/${staffId}`);
  }
  
  hasTakenExam(courseId: number, staffId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/student_exam/hasTakenExam/${courseId}/${staffId}`);
  }

  // Method to fetch the student's answers for a specific exam
  getStudentAnswers(examId: number, staffId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/student_exam/student-answers?examId=${examId}&studentId=${staffId}`);
  }

  submitExamAnswers(courseId: number, examId: number, staffId: string, answers: any[]): Observable<any> {
    const payload = { staffId, courseId, answers }; // Include courseId in the payload
    return this.http.post(`${this.apiUrl}/student_exam/${examId}/submit`, payload)
  }
  
}