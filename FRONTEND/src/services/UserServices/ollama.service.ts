  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root',
})
export class OllamaService {
  constructor(
    private http: HttpClient,
    private appInit: AppInitService,
  ) {}

  private get apiUrl(): string {
    return `${this.appInit.apiURL}/api/Ollama`; //  Now this is a valid string
  }
  
  
  analyzeTicket(issue: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/AnalyzeTicket`, { issue });
  }

}