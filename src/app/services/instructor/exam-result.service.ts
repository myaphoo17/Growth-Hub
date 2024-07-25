import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
    private apiUrl = 'http://localhost:8080'; // Base URL 

  constructor(private http: HttpClient) {}

  saveExamResult(examResult: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/exam-results/save`, examResult);
  }
}