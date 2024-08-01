import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Assignment } from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private baseUrl = 'http://localhost:8080/api/instructor-assignments';
  private apiUrl = 'http://localhost:8080/api/student-assignments';


  constructor(private http: HttpClient) {}

  createInstructorAssignment(assignment: Assignment): Observable<Assignment> {
    const staffId = this.getLoggedInUserStaffId();
    const payload = {
      ...assignment,
      assignmentCreatorId: staffId,
      courseId: assignment.courseId // Ensure courseId is included
 
    };

    return this.http.post<Assignment>(`${this.baseUrl}/create`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, `+
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
  uploadAssignment(instructorAssignmentId: number, studentStaffId: string, fileType: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('instructorAssignmentId', instructorAssignmentId.toString());
    formData.append('studentStaffId', studentStaffId);
    formData.append('fileType', fileType);
    formData.append('file', file);
  
    return this.http.post<any>(`${this.apiUrl}/upload`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
  

  getAssignmentsById(id: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/by-assignment/${id}`);
  }
  
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getAssignmentsByCourseId(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.baseUrl}/course/${courseId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

 
  getStudentAssignmentsByAssignmentId(assignmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-assignment/${assignmentId}`)
      .pipe(catchError(this.handleError));
  }
  
  getAssignmentsByStudent(studentId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-student/${studentId}`)
      .pipe(catchError(this.handleError));
  }
  getLoggedInUserStaffId(): string {
    return sessionStorage.getItem('userId') || '';
  }

  deleteStudentAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  deleteInstructorAssignment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

}