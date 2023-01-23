import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: `${process.env.WS_GATEWAY}`} })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  handleConnection() {
    console.log('connection made');
  };

  handleDisconnect() {
    console.log('disconnected');
  };

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, message: string) {
    this.server.emit('newMessage', message);
  };

}
