
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AppInitService } from '../app-init.service';

// // Feedback interface matches backend model


// @Injectable({
//   providedIn: 'root',
// })
// export class FeedbackService {
//   // private apiUrl = 'http://localhost:5000/api/TicketFeedback';
//   constructor(private http: HttpClient, private appInit: AppInitService) {}
//   get apiUrlFeedback(): string {
//     return `${this.appInit.apiURL}/api/TicketFeedback`;
//   }
//   // POST: Send feedback to the backend
//   submitFeedback(feedback: any): Observable<any> {
//     return this.http.post(this.apiUrlFeedback, feedback);
//   }
// getFeedbackByUser(email: string): Observable<any[]> {
//   return this.http.get<any[]>(`${this.apiUrlFeedback}/byUser/${email}`);
// }

//   // getAllFeedback(): Observable<Feedback[]> {
//   //   return this.http.get<Feedback[]>(this.apiUrlFeedback);
//   // }

//   getFeedbackStats(fromDate?: string, toDate?: string): Observable<any[]> {
//   let params = new HttpParams();
//   if (fromDate) params = params.set('fromDate', fromDate);
//   if (toDate) params = params.set('toDate', toDate);

//   return this.http.get<any[]>(`${this.apiUrlFeedback}/stats`, { params });
// }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

/* =========================
   INTERFACES
========================= */
export interface FeedbackStat {
  Year: number;
  Month: number;
  SupportAgent: string;
  TotalFeedbacks: number;
  AvgRating: number;
  AvgResponseTime: number;
  AvgTechnicalKnowledge: number;
  AvgProfessionalism: number;
  AvgCommunication: number;
  AvgResolution: number;
}

// feedback.service.ts

export interface TicketFeedback {
  TicketNumber?: string;
  CompanyName?: string;
  Unit?: string;
  FullName?: string;
  Email?: string;
  Phone?: string;
  SupportAgent?: string;
  OtherIssue?: string;
  IssueType?: string;
  SupportChannel?: string;
  DateRequested?: string;
  SignatureImagePath?: string;
  Rating?: number;
  [key: string]: any; // Allows additional dynamic properties flexible matching
}

/* =========================
   SERVICE
========================= */
@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private appInit: AppInitService
  ) {}

  /**
   * Dynamic base URL resolver
   */
  get apiUrlFeedback(): string {
    return `${this.appInit.apiURL}/api/TicketFeedback`;
  }

  /**
   * POST: Submit new feedback for a ticket
   */
  submitFeedback(feedback: TicketFeedback): Observable<any> {
    return this.http.post(this.apiUrlFeedback, feedback);
  }

  /**
   * GET: Retrieve feedback submitted by a specific user email
   */
  getFeedbackByUser(email: string): Observable<TicketFeedback[]> {
    return this.http.get<TicketFeedback[]>(
      `${this.apiUrlFeedback}/byUser/${encodeURIComponent(email)}`
    );
  }

  /**
   * GET: Retrieve feedback metrics grouped by agent and date range
   */
  getFeedbackStats(
    fromDate?: string,
    toDate?: string
  ): Observable<FeedbackStat[]> {
    let params = new HttpParams();

    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<FeedbackStat[]>(`${this.apiUrlFeedback}/stats`, {
      params,
    });
  }
}
