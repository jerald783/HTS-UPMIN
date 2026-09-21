import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(
    private http: HttpClient,
    private appInit: AppInitService,
  ) {}
  private hubConnection!: signalR.HubConnection;

  private get apiUrl(): string {
    return `${this.appInit.apiURL}/api/Ticket`; //  Now this is a valid string
  }
  private TicketAddedSubject = new BehaviorSubject<any>(null);

  TicketAdded$ = this.TicketAddedSubject.asObservable();

  startConnection(): void {
    const signalRUrl = '/hubs/notification';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR connected'))
      .catch((err) => console.error('❌ SignalR error:', err));

    // Listeners
    this.hubConnection.on('TicketAdded', (ticket) =>
      this.TicketAddedSubject.next(ticket),
    );
  }
  // GET all tickets by user
  getTicketsByUser(fromEmail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetTicketByUser/${fromEmail}`);
  }

  getAllTickets(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/GettAllTickets`);
  }
  // getTicketStats(): Observable<any[]> {
  //   return this.http.get<any>(`${this.apiUrl}/GetTicketStats`);
  // }
  getTicketStats(fromDate?: string, toDate?: string) {
    let url = `${this.apiUrl}/GetTicketStats`;
    const params: string[] = [];

    if (fromDate) params.push(`fromDate=${fromDate}`);
    if (toDate) params.push(`toDate=${toDate}`);

    if (params.length) url += '?' + params.join('&');

    return this.http.get<any[]>(url);
  }
  addTicketWithFiles(formData: FormData) {
    return this.http.post(`${this.apiUrl}/AddTicketWithFiles`, formData);
  }

  //  POST: Add new ticket
  addTicket(ticket: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddTicket`, ticket);
  }
  getTicketByUser(formemail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetTicketByUser/${formemail}`);
  }
  //  PUT: Update existing ticket
  // updateTicketStatus(ticketId: number, status: string): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/UpdateStatus/${ticketId}`, { CurrentStatus: status });
  // }
getSlaComplianceStats(fromDate?: string, toDate?: string): Observable<any[]> {
  let url = `${this.apiUrl}/GetSlaComplianceStats`;
  const params: string[] = [];

  if (fromDate) params.push(`fromDate=${fromDate}`);
  if (toDate) params.push(`toDate=${toDate}`);

  if (params.length) url += '?' + params.join('&');

  return this.http.get<any[]>(url);
}

  // updateTicketStatus(ticketId: number, status: string): Observable<any> {
  //   const agentEmail = localStorage.getItem('FullName'); // logged-in user email
  //   return this.http.put(`${this.apiUrl}/UpdateStatus/${ticketId}`, {
  //     CurrentStatus: status,
  //     AgentAssigned: agentEmail,
  //   });
  // }

updateTicketStatus(ticketId: number, status: string): Observable<any> {
  const agentEmail = localStorage.getItem('Email'); // Pass the logged-in agent's email

  return this.http.put(`${this.apiUrl}/UpdateStatus/${ticketId}`, {
    CurrentStatus: status,
    AgentAssigned: agentEmail,
  });
}

  //  PUT: Update overdue tickets
  updateOverdueTickets(): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateOverdueTickets`, {});
  }
  //  DELETE: Delete a ticket
  deleteTicket(ticketId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ticketId}`);
  }
  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Chat/${messageId}`);
  }
  // //  GET: Prop list (for dropdown or selection)
  // getAllProps(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/GetAllProp`);
  // }
  //  DELETE: Delete a Message by Ticket ID
  deleteMessagesByTicket(ticketId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/DeleteMessagesByTicket/${ticketId}`,
    );
  }
  getTicketFile(fileName: string) {
    return `${this.apiUrl}/file/${encodeURIComponent(fileName)}`;
  }
getAgents(): Observable<any> {
  return this.http.get(`${this.apiUrl}/GetAgents`);
}
assignAgent(ticketId: number, agent: string) {
  return this.http.put(`${this.apiUrl}/AssignAgent/${ticketId}`, {
    AgentAssigned: agent
  });
}


// getAgentDistribution() {
//   return this.http.get<any[]>(`${this.apiUrl}/GetAgentDistribution`);
// }
getAgentClosingStats(fromDate?: string, toDate?: string, year?: number) {
  let params: any = {};

  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  if (year) params.year = year;

  return this.http.get<any[]>(`${this.apiUrl}/GetAgentClosingStats`, { params });
}

updateDiagnosticResult(id: number, diagnosticResult: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateDiagnosticResult/${id}`, {
      Diagnostic_Result: diagnosticResult
    });
  }

// analyzeAllTickets(): Observable<{ totalAnalyzed: number; analysis: string }> {
//   return this.http.post<{ totalAnalyzed: number; analysis: string }>(
//     `${this.apiUrl}/analyze-all`,
//     {}
//   );
// }
analyzeAllTickets(fromDate?: string, toDate?: string): Observable<{ totalAnalyzed: number; analysis: string }> {
  let url = `${this.apiUrl}/analyze-all`;
  const params: string[] = [];

  if (fromDate) params.push(`fromDate=${fromDate}`);
  if (toDate) params.push(`toDate=${toDate}`);

  if (params.length) url += '?' + params.join('&');

  return this.http.post<{ totalAnalyzed: number; analysis: string }>(url, {});
}
}
