import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../auth/guards/jwt.guard';
import { AuthService } from '../../../auth/services/auth.service';
import { ConversationService } from '../../services/conversation.service';
import { of, Subscription, take, tap } from 'rxjs';
import { User } from '../../../auth/entity/user.class';
import { Conversation } from '../../entity/conversation.interface';
import { ActiveConversation } from '../../entity/active-conversation.interface';
import { Message } from '../../entity/message.interface';

@WebSocketGateway({ cors: { origin: `${ process.env.WS_GATEWAY }`} })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  constructor(private authService: AuthService, private conversationService: ConversationService) {}

  // Note: runs when server starts - remove in production
  onModuleInit() {
    this.conversationService.removeActiveConversations().pipe(take(1)).subscribe();
    this.conversationService.removeMessages().pipe(take(1)).subscribe();
    this.conversationService.removeConversations().pipe(take(1)).subscribe();
  };

  @WebSocketServer()
  server: Server;

  @UseGuards(JwtGuard)
  handleConnection(socket: Socket) {
    console.log('HANDLE CONNECTION');

    const jwt = socket.handshake.headers.authorization || null;
    this.authService.getJwtUser(jwt).subscribe((user: User) => {
      if (!user) {
        console.log('No user');
        this.handleDisconnect(socket);
      } else {
        console.log(user);
        socket.data.user = user;
        this.getConversations(socket, user.id);
      }
    });
  };

  getConversations(socket: Socket, userId: number): Subscription {
    return this.conversationService.getConversationsWithUsers(userId).subscribe(
        (conversations: Conversation[]) => {
          this.server.to(socket.id).emit('conversations', conversations);
        }
    );
  };

  handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');
    this.conversationService
        .leaveConversation(socket.id)
        .pipe((take(1)))
        .subscribe();
  };

  @SubscribeMessage('createConversation')
  createConversation(socket: Socket, friend: User) {
    this.conversationService.createConversation(socket.data.user, friend)
        .pipe(take(1))
        .subscribe(() => {
          this.getConversations(socket, socket.data.user.id)
        });
  };

  @SubscribeMessage('sendMessage')
  handleMessage(socket: Socket, newMessage: Message) {
    if (!newMessage.conversation) return of(null);

    const { user } = socket.data;
    newMessage.user = user;

    if (newMessage.conversation.id) {
      this.conversationService
          .createMessage(newMessage)
          .pipe(take(1))
          .subscribe((message: Message) => {
            newMessage.id = message.id;
            this.conversationService
                .getActiveUsers(newMessage.conversation.id)
                .pipe(take(1))
                .subscribe((activeConversations: ActiveConversation[]) => {
                  activeConversations.forEach((activeConversation: ActiveConversation) => {
                    this.server.to(activeConversation.socketId).emit('newMessage', newMessage);
                  });
                });
          });
    }
  };

  @SubscribeMessage('joinConversation')
  joinConversation(socket: Socket, friendId: number) {
    this.conversationService.joinConversation(friendId, socket.data.user.id, socket.id)
        .pipe(
            tap((activeConversation: ActiveConversation) => {
              this.conversationService.getMessages(activeConversation.conversationId)
                  .pipe(take(1))
                  .subscribe((messages: Message[]) => {
                    this.server.to(socket.id).emit('messages', messages);
                  });
            }),
        )
        .pipe(take(1))
        .subscribe();
  };

  @SubscribeMessage('leaveConversation')
  leaveConversation(socket: Socket) {
    this.conversationService
        .leaveConversation(socket.id)
        .pipe(take(1))
        .subscribe();
  };

}
