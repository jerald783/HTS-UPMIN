import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppInitService } from '../app-init.service';

@Injectable({
  providedIn: 'root'
})
export class ExtraFieldService {

  // api = "http://localhost:5000/api/TicketExtraFields";
  constructor(private http: HttpClient, private appInit: AppInitService) {}
  get api(): string {
    return `${this.appInit.apiURL}/api/TicketExtraFields`;
  }
  getFields(){
    return this.http.get(this.api);
  }

  addField(data:any){
    return this.http.post(this.api,data);
  }

  deleteField(id:number){
    return this.http.delete(`${this.api}/${id}`);
  }

}