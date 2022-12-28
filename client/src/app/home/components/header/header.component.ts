import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { FriendRequest } from '../../models/FriendRequest';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequestStatusEnum } from '../../models/friend-request.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService,
  ) {}

  userImagePath: string;
  private userImagePathSubscription: Subscription;

  friendRequests: FriendRequest[];
  private friendRequestsSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
      });
    this.friendRequestsSubscription = this.connectionProfileService.getFriendRequests().subscribe(
      (friendRequests: FriendRequest[]) => {
        this.connectionProfileService.friendRequests = friendRequests.filter((friendRequest: FriendRequest) => {
          return friendRequest.status === FriendRequestStatusEnum.PENDING;
        });
      });
  };

  async presentPopover(event: any): Promise<void> {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`onDidDismiss resolved with role`, role);
  };

  async presentFriendRequestPopover(event: any): Promise<void> {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`onDidDismiss resolved with role`, role);
  };

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  };

}
