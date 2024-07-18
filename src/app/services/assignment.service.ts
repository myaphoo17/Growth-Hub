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

  constructor(private http: HttpClient) {}

  createInstructorAssignment(assignment: Assignment): Observable<Assignment> {
    const staffId = this.getLoggedInUserStaffId();
    const payload = {
      ...assignment,
      assignmentCreatorId: staffId 
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
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }

  uploadAssignment(id: number, fileType: string, file: File): Observable<Assignment> {
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('file', file);

    return this.http.post<Assignment>(`${this.baseUrl}/upload/${id}`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.baseUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLoggedInUserStaffId(): string {
    return sessionStorage.getItem('userId') || '';
  }
}
