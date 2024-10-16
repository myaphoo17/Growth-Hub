import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const SERVER_URL = 'http://localhost:8080/connect';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Stomp.Client | undefined;
  public isConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.connect(); // Ensure WebSocket connection is established
  }

  connect() {
    const ws = new SockJS(SERVER_URL);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      this.isConnected$.next(true);
    }, this.onError);
  }

  onConnect2(staffId: string): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.stompClient || !this.stompClient.connected) {
        observer.error('WebSocket is not initialized or connected.');
        return;
      }

      this.stompClient.subscribe(`/user/${staffId}/privateMessage`, (response) => {
        const receivedMessage = JSON.parse(response.body);
        observer.next(receivedMessage);
      });

      // Cleanup on unsubscribe
      return () => this.stompClient?.unsubscribe(`/user/${staffId}/privateMessage`);
    });
  }

  onConnectNotif(staffId: string): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.stompClient || !this.stompClient.connected) {
        observer.error('WebSocket is not initialized or connected.');
        return;
      }
      
      this.stompClient.subscribe(`/user/${staffId}/notif`, (response) => {
        const receivedMessage = JSON.parse(response.body);
        observer.next(receivedMessage);
      });
      // Cleanup on unsubscribe
      return () => this.stompClient?.unsubscribe(`/user/${staffId}/notif`);
    });
  }
  getSignal(staffId: string): Observable<any> {
    return new Observable<any>((observer) => {
      if (!this.stompClient || !this.stompClient.connected) {
        observer.error('WebSocket is not initialized or connected in getSignal.');
        return;
      }
      const subscription = this.stompClient.subscribe(`/topic/${staffId}/signal`, (response) => {
        const receivedMessage = JSON.parse(response.body);
        observer.next(receivedMessage);
      });

      return () => subscription.unsubscribe();
    });
  }

  sendSignal(signal: any) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/signal', {}, JSON.stringify(signal));
    } else {
      console.error('WebSocket is not initialized or connected.');
    }
  }

  onError = (error: any) => {
    console.error('WebSocket error:', error);
  }

  sendMessageNotif(userStaffIdReceiver: string, content: string) {
    const chatDtoReq = {
      userStaffIdReceiver: userStaffIdReceiver,
      content: content,
    };
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/notification', {}, JSON.stringify(chatDtoReq));
    } else {
      console.error('WebSocket is not initialized or connected.');
    }
  }

  sendPrivateMessage(userFromStaffId: string, recipientStaffId: string, content: string, typeMessage: string) {
    const privateMessage = {
      userFromStaffId: userFromStaffId,
      recipientStaffId: recipientStaffId,
      content: content,
      typeMessage: typeMessage
    };
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send('/app/privateMessage', {}, JSON.stringify(privateMessage));
    } else {
      console.error('WebSocket is not initialized or connected.');
    }
  }

  public disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        if (this.stompClient) {
          this.stompClient.ws.close();
        }
        this.isConnected$.next(false);
      });
    }
  }
}
