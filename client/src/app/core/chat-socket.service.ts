import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:5001',
  options: {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: localStorage.getItem('CapacitorStorage.token'),
        },
      },
    },
  },
};

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService extends Socket {
  constructor() {
    super(config);
  };
}
