import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';

interface UpdateUserPayload {
  FullName: string;
  Email: string;
  RoleId?: number;
  Password?: string;
}
@Injectable({
  providedIn: 'root',
})


export class UserService {
  constructor(private http: HttpClient, private appInit: AppInitService) {}

  get apiUser(): string {
    return `${this.appInit.apiURL}/api/User`;
  }
  // =========================
  // REGISTER
  // =========================
  // register(user: any): Observable<any> {

  //   return this.http.post(
  //     `${this.apiUser}/register-otp`,
  //     user,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       }),
  //       withCredentials: true
  //     }
  //   );
  // }


  // =========================
  // ROLES
  // =========================
  getRoles(): Observable<any> {

    return this.http.get(
      `${this.apiUser}/roles`,
      {
        withCredentials: true
      }
    );
  }
 getRoleId() {

    return this.http.get<{ id: number, name: string }[]>(
      `${this.apiUser}/roles`,
      {
        withCredentials: true
      }
    );
  }
  // =========================
  // LOGIN
  // =========================
  login(email: string, password: string): Observable<any> {

    return this.http.post(
      `${this.apiUser}/login`,
      {
        Email: email,
        Password: password
      },
      {
        withCredentials: true
      }
    );
  }
  
  // getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('authToken');
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${token}`,
  //   });
  // }


  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('authToken');
  // }


 // =========================
  // USERS
  // =========================
  getAllUser(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUser}/all`,
      {
        withCredentials: true
      }
    );
  }

  // updateUser(id: number, user: any) {

  //   return this.http.put(
  //     `${this.apiUser}/${id}`,
  //     user,
  //     {
  //       withCredentials: true
  //     }
  //   );
  // }
updateUser(id: number, user: UpdateUserPayload) {
  return this.http.put(
    `${this.apiUser}/${id}`,
    user,
    {
      withCredentials: true
    }
  );
}
  deleteUser(id: number) {

    return this.http.delete(
      `${this.apiUser}/${id}`,
      {
        withCredentials: true
      }
    );
  }
 // =========================
  // LOGOUT
  // =========================
  logout(): Observable<any> {

    // remove NON-SENSITIVE local storage only
    localStorage.removeItem('userRole');
    localStorage.removeItem('Email');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email'); // if you were storing a token
    // backend clears HttpOnly cookie
    return this.http.post(
      `${this.apiUser}/logout`,
      {},
      {
        withCredentials: true
      }
    );
  }
    // =========================
  // AUTH VALIDATION
  // =========================
  validateSession(): Observable<any> {

    return this.http.get(
      `${this.apiUser}/validate`,
      {
        withCredentials: true
      }
    );
  }
  

  // =========================
  // AGENTS
  // =========================
  getAgents(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUser}/agents`,
      {
        withCredentials: true
      }
    );
  }

  getZoomRecipients(): Observable<any[]> {

    return this.http.get<any[]>(
      `${this.apiUser}/zoom-recipients`,
      {
        withCredentials: true
      }
    );
  }

  // =========================
  // LOCAL USER DATA
  // =========================
  setAuthData(role: string): void {

    // SAFE ONLY
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string | null {

    return localStorage.getItem('userRole');
  }

  getUserEmail(): string | null {

    return localStorage.getItem('Email');
  }
}

