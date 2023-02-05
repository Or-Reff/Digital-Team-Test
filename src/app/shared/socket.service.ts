import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket | undefined;

  // constructor() { }

  setupSocketConnection(): void {
    this.socket = io(environment.socketUrl, {
    });
  }

  disconnect(): void {
    if (!this.socket) {
      throw new Error('Socket connection is not established');
    }
    this.socket.disconnect();
  }

}
