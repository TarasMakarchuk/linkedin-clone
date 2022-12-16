import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}

  userImagePath: string;
  private userImagePathSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
      });
  };

  async onSignOut(): Promise<void> {
    await this.authService.logout();
  };

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  };
}
