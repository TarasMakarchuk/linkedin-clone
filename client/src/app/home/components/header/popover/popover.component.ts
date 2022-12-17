import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  userImagePath: string;
  private userImagePathSubscription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
      });

    this.authService.userFullName
      .pipe(take(1))
      .subscribe((fullName: string) => {
        this.fullName = fullName;
        this.fullName$.next(fullName);
      });
  };

  async onSignOut(): Promise<void> {
    await this.authService.logout();
  };

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  };
}
