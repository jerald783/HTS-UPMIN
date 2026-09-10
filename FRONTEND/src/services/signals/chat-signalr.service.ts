// import { Injectable } from '@angular/core';
// import * as signalR from '@microsoft/signalr';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ChatSignalRService {
//   private hubConnection!: signalR.HubConnection;

//   //  Add chat message subject
//   private chatMessageSubject = new BehaviorSubject<any>(null);
//   public chatMessage$ = this.chatMessageSubject.asObservable();

//   //  Start SignalR connection
//   startConnection(): void {
//     const signalRUrl = '/hubs/notification'; // or full URL: http://localhost:5001/hubs/notification

//     this.hubConnection = new signalR.HubConnectionBuilder()
//       .withUrl(signalRUrl)
//       .withAutomaticReconnect()
//       .build();

//     this.hubConnection
//       .start()
//       .then(() => console.log('✅ SignalR connected'))
//       .catch(err => console.error('❌ SignalR error:', err));

//     // 🔁 Listen for incoming chat messages
//     this.hubConnection.on('ReceiveMessage', (message) => {
//       this.chatMessageSubject.next(message);
//     });
//   }

//   //  Add group join method
//   joinTicketGroup(ticketId: number): void {
//     if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
//       this.hubConnection.invoke('AddToGroup', `ticket-${ticketId}`)
//         .catch(err => console.error('Failed to join group:', err));
//     }
//   }

//   //  Add group leave method
//   leaveTicketGroup(ticketId: number): void {
//     if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
//       this.hubConnection.invoke('RemoveFromGroup', `ticket-${ticketId}`)
//         .catch(err => console.error('Failed to leave group:', err));
//     }
//   }
// }
