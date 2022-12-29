import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConnectionProfileService } from '../../../services/connection-profile.service';
import { FriendRequest } from '../../../models/FriendRequest';
import { take, tap } from 'rxjs/operators';
import { User } from '../../../../auth/models/user.model';
import { environment } from '../../../../../environments/environment';

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

}
