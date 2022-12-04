import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  async onSignOut(): Promise<void> {
    await this.authService.logout();
  }
}
