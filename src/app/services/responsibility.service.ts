import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Responsibility } from '../models/Responsibility';

@Injectable({
  providedIn: 'root',
})
export class ResponsibilityService {
  private apiUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  getResponsibilities(): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(`${this.apiUrl}/responsibilities`);
  }
}
