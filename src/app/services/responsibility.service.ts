import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Responsibility } from '../models/Responsibility';

@Injectable({
  providedIn: 'root',
})
export class ResponsibilityService {
  private baseUrl = 'http://localhost:3000/responsibilities';

  constructor(private http: HttpClient) {}

  /**
   * GET /responsibilities
   */
  getResponsibilities(): Observable<Responsibility[]> {
    return this.http.get<Responsibility[]>(this.baseUrl);
  }

  /**
   * GET /responsibilities/:id
   */
  getResponsibilityById(id: number): Observable<Responsibility> {
    return this.http.get<Responsibility>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /responsibilities
   */
  createResponsibility(responsibility: Partial<Responsibility>): Observable<Responsibility> {
    return this.http.post<Responsibility>(this.baseUrl, responsibility);
  }

  /**
   * PUT /responsibilities/:id
   */
  updateResponsibility(
    id: number,
    responsibility: Partial<Responsibility>,
  ): Observable<Responsibility> {
    return this.http.put<Responsibility>(`${this.baseUrl}/${id}`, responsibility);
  }

  /**
   * DELETE /responsibilities/:id
   */
  deleteResponsibility(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
