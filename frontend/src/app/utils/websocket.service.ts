import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket;
  private listeners: ((data: any) => void)[] = [];

  constructor(private zone: NgZone) {
    this.socket = new WebSocket("ws://192.168.0.93:8000/ws/items");

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      this.zone.run(() => {
        this.listeners.forEach(cb => cb(data));
      });
    };
  }

  onMessage(cb: (data: any) => void) {
    this.listeners.push(cb);
  }
}
