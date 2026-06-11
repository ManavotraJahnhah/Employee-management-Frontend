import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/Department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = 'http://localhost:3000/departments';

  constructor(private http: HttpClient) {}

  /**
   * GET /departments
   */
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  /**
   * GET /departments/:id
   */
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /departments
   */
  createDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }

  /**
   * PUT /departments/:id
   */
  updateDepartment(id: number, department: Partial<Department>): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
  }

  /**
   * DELETE /departments/:id
   */
  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
