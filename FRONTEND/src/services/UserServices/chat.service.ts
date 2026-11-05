
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppInitService } from '../app-init.service';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class ChatService {

  // private hubConnection!: signalR.HubConnection;

  // private ChatAddedSubject = new BehaviorSubject<any>(null);
  // ChatAdded$ = this.ChatAddedSubject.asObservable();

  // private notificationSubject = new Subject<any>();
  // Notification$ = this.notificationSubject.asObservable();
  // NotificationCleared$: any;

  private hubConnection!: signalR.HubConnection;

  // Chat messages
  private ChatAddedSubject = new BehaviorSubject<any>(null);
  ChatAdded$ = this.ChatAddedSubject.asObservable();

  // Notifications
  private notificationSubject = new Subject<any>();
  Notification$ = this.notificationSubject.asObservable();

  // Cleared notifications
  private notificationClearedSubject = new Subject<number>();
  NotificationCleared$ = this.notificationClearedSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private appInit: AppInitService
  ) {}

  // =========================
  // SIGNALR CONNECTION
  // =========================
  // startConnection(): void {
  //   if (this.hubConnection) return;

  //   const url = `${this.appInit.apiURL}/hubs/notification`;

  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(url)
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection.start()
  //     .then(() => console.log('✅ SignalR connected'))
  //     .catch(err => console.error('❌ SignalR error:', err));

  //   const handler = (msg: any) => {
  //     this.ChatAddedSubject.next(msg);
  //     this.notificationSubject.next(msg);
  //   };

  //   // Listen to both events
  //   this.hubConnection.on('MessageAdded', handler);
  //   this.hubConnection.on('ReceiveMessage', handler);

    
  // }
    startConnection(): void {
    if (this.hubConnection) return;

    const url = `${this.appInit.apiURL}/hubs/notification`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR error:', err));

    const handler = (msg: any) => {
      this.ChatAddedSubject.next(msg);
      this.notificationSubject.next(msg);
    };

    // Listen to both events
    this.hubConnection.on('MessageAdded', handler);
    this.hubConnection.on('ReceiveMessage', handler);

    // Example: listen for cleared notifications
    this.hubConnection.on('NotificationCleared', (ticketId: number) => {
      this.notificationClearedSubject.next(ticketId);
    });
  }

  // =========================
  // CHAT API METHODS
  // =========================
  getMessages(ticketId: number) {
    return this.http.get<any[]>(`${this.appInit.apiURL}/api/Chat/chat/${ticketId}`);
  }

  sendMessage(payload: any) {
    return this.http.post<any>(`${this.appInit.apiURL}/api/Chat/chat`, payload);
  }

  sendMessageWithFile(formData: FormData) {
    return this.http.post<any>(`${this.appInit.apiURL}/api/Chat/chat/upload`, formData);
  }

  // =========================
  // NOTIFICATION API METHODS
  // =========================

  /** Get all notifications for the current user */
  getNotifications(email: string) {
    return this.http.get<any[]>(`${this.appInit.apiURL}/api/Chat/notifications?email=${email}`);
  }

  /** Mark a notification as read */
  markNotificationRead(notificationId: number) {
    return this.http.post(`${this.appInit.apiURL}/api/Chat/notifications/read/${notificationId}`, {});
  }

  /** Mark all notifications for a specific ticket as read */
markTicketNotificationsRead(ticketId: number, email: string) {
  return this.http.post(`${this.appInit.apiURL}/api/Chat/notifications/read-ticket`, { ticketId, email });
}
  notifyCleared(ticketId: number) {
    this.notificationClearedSubject.next(ticketId);
  }

getTicketNumber(ticketId: number) {
  return this.http.get<{ TicketNumber: string }>(`${this.appInit.apiURL}/api/Chat/${ticketId}/number`);
}
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Subject } from 'rxjs';
// import { AppInitService } from '../app-init.service';
// import * as signalR from '@microsoft/signalr';

// @Injectable({ providedIn: 'root' })
// export class ChatService {

//   private hubConnection!: signalR.HubConnection;

//   private ChatAddedSubject = new BehaviorSubject<any>(null);
//   ChatAdded$ = this.ChatAddedSubject.asObservable();

//   private notificationSubject = new Subject<any>();
//   Notification$ = this.notificationSubject.asObservable();
//   NotificationCleared$: any;

//   constructor(
//     private http: HttpClient,
//     private appInit: AppInitService
//   ) {}

//   // =========================
//   // SIGNALR CONNECTION
//   // =========================
//   startConnection(): void {
//     if (this.hubConnection) return;

//     const url = `${this.appInit.apiURL}/hubs/notification`;

//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(url)
//       .withAutomaticReconnect()
//       .build();

//     this.hubConnection.start()
//       .then(() => console.log(' SignalR connected'))
//       .catch(err => console.error('❌ SignalR error:', err));

//     const handler = (msg: any) => {
//       this.ChatAddedSubject.next(msg);
//       this.notificationSubject.next(msg);
//     };

//     // Listen to both events
//     this.hubConnection.on('MessageAdded', handler);
//     this.hubConnection.on('ReceiveMessage', handler);

    
//   }
  

//   // =========================
//   // CHAT API METHODS
//   // =========================
//   getMessages(ticketId: number) {
//     return this.http.get<any[]>(`${this.appInit.apiURL}/api/chat/chat/${ticketId}`);
//   }

//   sendMessage(payload: any) {
//     return this.http.post<any>(`${this.appInit.apiURL}/api/chat/chat`, payload);
//   }

//   sendMessageWithFile(formData: FormData) {
//     return this.http.post<any>(`${this.appInit.apiURL}/api/chat/chat/upload`, formData);
//   }

//   // =========================
//   // NOTIFICATION API METHODS
//   // =========================

//   /** Get all notifications for the current user */
//   getNotifications(email: string) {
//     return this.http.get<any[]>(`${this.appInit.apiURL}/api/chat/notifications?email=${email}`);
//   }

//   /** Mark a notification as read */
//   markNotificationRead(notificationId: number) {
//     return this.http.post(`${this.appInit.apiURL}/api/chat/notifications/read/${notificationId}`, {});
//   }

//   /** Mark all notifications for a specific ticket as read */
// markTicketNotificationsRead(ticketId: number, email: string) {
//   return this.http.post(`${this.appInit.apiURL}/api/chat/notifications/read-ticket`, { ticketId, email });
// }


// }
