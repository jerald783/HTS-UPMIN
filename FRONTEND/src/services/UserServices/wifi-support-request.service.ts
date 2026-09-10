// support-request.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

@Injectable({
  providedIn: 'root'
})
export class WifiSupportRequestService {
 

  constructor(private http: HttpClient,private appInit: AppInitService) { }
 get apiUrl(): string {
    return `${this.appInit.apiURL}/api/TicketWifi`;
  }
  // =========================================================
  // GET ALL
  // =========================================================
  getAllSupportRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/GetAllSupportRequests`
    );
  }

  // =========================================================
  // GET BY EMAIL
  // =========================================================
  getSupportRequestByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/GetSupportRequestByEmail/${email}`
    );
  }

  // =========================================================
  // ADD
  // =========================================================
  addSupportRequest(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/AddSupportRequest`,
      data
    );
  }

  // =========================================================
  // UPDATE
  // =========================================================
  updateSupportRequest(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/UpdateSupportRequest/${id}`,
      data
    );
  }

  // =========================================================
  // DELETE
  // =========================================================
  deleteSupportRequest(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/DeleteSupportRequest/${id}`
    );
  }
}