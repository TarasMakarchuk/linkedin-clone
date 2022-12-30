import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConnectionProfileService } from '../../../services/connection-profile.service';
import { FriendRequest } from '../../../models/FriendRequest';
import { take, tap } from 'rxjs/operators';
import { User } from '../../../../auth/models/user.model';
import { environment } from '../../../../../environments/environment';
import { FriendRequestStatusEnum } from '../../../models/friend-request.enum';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController,
  ) {}

  ngOnInit() {
    this.connectionProfileService.friendRequests.map((friendRequest: FriendRequest) => {
      const creatorId = (friendRequest as any)?.creator?.id;
      if (friendRequest && creatorId) {
        this.connectionProfileService.getConnectionUser(creatorId)
          .pipe(
            take(1),
            tap((user: User) => {
              friendRequest['imagePath'] = `${environment.baseApiUrl}/user/image/${user?.imagePath ||
              `default-avatar.png`}`;
            }),
          ).subscribe();
      }
    });
  };

  async respondToFriendRequest(
    id: number,
    statusResponse: FriendRequestStatusEnum.ACCEPTED | FriendRequestStatusEnum.DECLINED,
  ) {
    const handleFriendRequest: FriendRequest = this.connectionProfileService.friendRequests.find(
      (friendRequest: FriendRequest) => friendRequest.id === id
    );
    const unhandledFriendRequests: FriendRequest[] = this.connectionProfileService.friendRequests.filter(
      (friendRequest: FriendRequest) => friendRequest.id !== handleFriendRequest.id
    );
    this.connectionProfileService.friendRequests = unhandledFriendRequests;

    if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  };
}
