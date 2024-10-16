import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginModel } from '../model/loginModel';
import { Observable, throwError } from 'rxjs';
import { forGetPassModel } from '../model/forgetPassModel';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private loginUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  login(loginData: loginModel): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.loginUrl}/login`, loginData, { headers });
  }
  checkingEmail(email: string): Observable<forGetPassModel> {
    return this.http.get<forGetPassModel>(`${this.loginUrl}/forgot-password/${email}`) .pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 404 && error.error.message) {
        errorMessage = error.error.message;  // Use the message from the backend
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
  updatePassword(updateData: forGetPassModel): Observable<Object> {
    return this.http.put(`${this.loginUrl}/updatePassword`, updateData);
  }
  changePassword(newPass: string, staffId: string): Observable<any> {
    const url = `${this.loginUrl}/changePassword/${encodeURIComponent(newPass)}/${encodeURIComponent(staffId)}`;
    return this.http.post(url, {});
  }
}