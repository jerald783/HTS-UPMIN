import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';
export interface SavedPmLogHeader {
  Id: number;
  DocumentCode: string;
  Department: string;
  BuildingRoom: string;
  Custodian: string;
  ServicingDate: string;
  MaintenanceClass: string;
  TechName: string;
  TechDate: string;
  CustodianName: string;
  CustodianDate: string;
}
export interface MaintenanceItem {
  id?: number;
  pmLogId?: number;
  propertyTag: string;
  serialNumber: string;
  deviceModel: string;
  hw: boolean;
  os: boolean;
  sec: boolean;
  status: 'P' | 'W' | 'J' | 'U' | '';
  remarks: string;
}

export interface Signatures {
  techName: string;
  techDate: string;
  techSignatureBase64?: string;
  custodianName: string;
  custodianDate: string;
  custodianSignatureBase64?: string;
}

export interface PmLogPayload {
  id: number;
  documentCode: string;
  department: string;
  buildingRoom: string;
  custodian: string;
  servicingDate: string;
  maintenanceClass: string;
  signatures: Signatures;
  items: MaintenanceItem[];
}

@Injectable({
  providedIn: 'root'
})
export class ItoPmsLogService {

    constructor(
      private http: HttpClient,
      private appInit: AppInitService,
    ) {}

      private get apiUrl(): string {
    return `${this.appInit.apiURL}/api/PMlog`; 
  }
getAllLogs(): Observable<SavedPmLogHeader[]> {
    return this.http.get<SavedPmLogHeader[]>(this.apiUrl);
  }

getLogById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  postLog(payload: PmLogPayload): Observable<{ message: string; id: number }> {
    return this.http.post<{ message: string; id: number }>(this.apiUrl, payload);
  }

  putLog(payload: PmLogPayload): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.apiUrl, payload);
  }

 deleteLog(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  
}