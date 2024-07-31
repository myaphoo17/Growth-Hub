import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriesDTO } from '../../models/instructor/categoriesDTO';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/categories'; // Adjust the URL as needed

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CategoriesDTO[]> {
    return this.http.get<CategoriesDTO[]>(`${this.apiUrl}/getAllCategories`);
  }
}
