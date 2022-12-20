import { Component, OnInit } from '@angular/core';
import { BannerColorService } from '../../services/banner-color.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../../../auth/models/user.model';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})

export class ConnectionProfileComponent implements OnInit {
  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    private connectionProfileService: ConnectionProfileService,
  ) {}

  ngOnInit() {
    this.getUser().subscribe((x) => console.log(3, x));
  };

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId);
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

}
