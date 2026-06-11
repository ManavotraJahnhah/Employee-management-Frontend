import { Injectable } from '@angular/core';
import { Department } from '../models/Department';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }
}
