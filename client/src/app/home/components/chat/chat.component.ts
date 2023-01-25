import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/models/user.model';
import { ChatService } from '../../services/chat.service';

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
  newMessage$: Observable<string>;
  messages: string[] = [];

  friends: User[] = [];
  friend: User;
  friend$: BehaviorSubject<User> = new BehaviorSubject<User>({});

  selectedConversationIndex: number = 0;

  private userImagePathSubscription: Subscription;
  private messageSubscription: Subscription;
  private friendsSubscription: Subscription;

  ionViewDidEnter() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe((imagePath: string) => {
      this.userImagePath = imagePath;
    });

    this.messageSubscription = this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.friendsSubscription = this.chatService.getFriends().subscribe((friends: User[]) => {
      this.friends = friends;
    });
  };

  onSubmit() {
    const { message } = this.form.value;
    if (!message) return;
    this.chatService.sendMessage(message);
    this.form.reset();
  };

  openConversation(friend: User, index: number): void {
    this.selectedConversationIndex = index;
    this.friend = friend;
    this.friend$.next(this.friend);
  };

  ionViewDidLeave() {
    this.userImagePathSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.friendsSubscription.unsubscribe();
  };
}
