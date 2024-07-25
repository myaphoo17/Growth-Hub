import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthlyDataModel } from '../../models/charts/MonthlyDataModel';

@Injectable({
  providedIn: 'root'
})
export class ChartsServices {
  private baseURL = "http://localhost:8080/admin"; // Ensure this matches your backend URL

  constructor(private httpClient: HttpClient) { }

  getMonthlyData(year: number): Observable<MonthlyDataModel[]> {
    return this.httpClient.get<MonthlyDataModel[]>(`${this.baseURL}/monthly-data/${year}`);
  }

  getMonthlyDatabyId(staffId: number, year: number): Observable<MonthlyDataModel[]> {
    return this.httpClient.get<MonthlyDataModel[]>(`${this.baseURL}/monthly-data/${staffId}/${year}`);
  }
}
