import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ConnectionProfileService } from '../../../services/connection-profile.service';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  constructor(
    private connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController,
  ) {}

  ngOnInit() {}

}
