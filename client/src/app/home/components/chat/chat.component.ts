import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';
import { ChatService } from '../../services/chat.service';
import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
  ) {}

  @ViewChild('form') form: NgForm;

  userImagePath: string;
  userId: number;

  conversations$: Observable<Conversation[]>;
  conversations: Conversation[] = [];
  conversation: Conversation;

  newMessage$: Observable<string>;
  messages: Message[] = [];

  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});

  selectedConversationIndex: number = 0;

  private userImagePathSubscription: Subscription;
  private userIdSubscription: Subscription;
  private messagesSubscription: Subscription;
  private conversationSubscription: Subscription;
  private newMessagesSubscription: Subscription;
  private friendsSubscription: Subscription;
  private friendSubscription: Subscription;

  ionViewDidEnter() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe((imagePath: string) => {
      this.userImagePath = imagePath;
    });

    this.userIdSubscription = this.authService.userId.subscribe((userId: number) => {
      this.userId = userId;
    });

    this.conversationSubscription = this.chatService.getConversations().subscribe((conversations: Conversation[]) => {
      this.conversations.push(conversations[0]); // Note: from mergeMap stream
    });

    this.messagesSubscription = this.chatService.getConversationMessages().subscribe((messages: Message[]) => {
      messages.forEach((message: Message) => {
        const allMessageIds = this.messages.map(
          (message: Message) => message.id
        );
        if (!allMessageIds.includes(message.id)) {
          this.messages.push(message)
        }
      });
    });

    this.friendsSubscription = this.chatService.getFriends().subscribe((friends: User[]) => {
      this.friends = friends;
    });
  };

  onSubmit() {
    const { message } = this.form.value;
    if (!message) return;
    this.chatService.sendMessage(message, this.conversation);
    this.form.reset();
  };

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
    this.friend = friend;
    this.friend$.next(this.friend);
  };

  ionViewDidLeave() {
    this.userImagePathSubscription.unsubscribe();
    this.userIdSubscription.unsubscribe();
    this.newMessagesSubscription.unsubscribe();
    this.messagesSubscription.unsubscribe();
    this.conversationSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
    this.friendSubscription.unsubscribe();
  };
}
