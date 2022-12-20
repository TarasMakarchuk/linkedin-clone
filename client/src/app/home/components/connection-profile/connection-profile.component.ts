import { Component, OnDestroy, OnInit } from '@angular/core';
import { BannerColorService } from '../../services/banner-color.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from '../../../auth/models/user.model';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequestStatus, FriendRequest_Status } from '../../models/FriendRequest';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})

export class ConnectionProfileComponent implements OnInit, OnDestroy {
  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connectionProfileService: ConnectionProfileService,
  ) {}

  user: User;
  friendRequestStatus: FriendRequest_Status;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  ngOnInit() {
    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus().pipe(
      tap((friendRequestStatus: FriendRequestStatus) => {
        this.friendRequestStatus = friendRequestStatus.status;
        this.userSubscription$ = this.getUser().subscribe((user: User) => {
          this.user = user;
          const imagePath = user.imagePath ?? 'default-avatar.png';
          this.user['imagePath'] = `http://localhost:5001/api/user/image/${imagePath}`;
        })
      })
    ).subscribe();
  };

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId);
      })
    );
  };

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getFriendRequestStatus(userId)
      })
    );
  };

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return Number(urlSegment[0].path);
      })
    );
  };

  ngOnDestroy(): void {
    this.userSubscription$.unsubscribe();
    this.friendRequestStatusSubscription$.unsubscribe();
  };

}
