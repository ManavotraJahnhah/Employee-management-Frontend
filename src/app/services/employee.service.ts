import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  // Service HTTP centralisé pour l'accès à l'API backend
  // 🌐 Base API URL (centralized)
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // =========================
  // 👨‍💼 EMPLOYEES
  // =========================

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  createEmployee(payload: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, payload);
  }

  updateEmployee(id: number, payload: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, payload);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employees/${id}`);
  }

  checkEmployeeCode(code: string) {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/employees/check-code/${code}`);
  }
}
