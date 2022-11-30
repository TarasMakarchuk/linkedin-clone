import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NewUser } from './models/new-user.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;
  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) return;
    if (this.submissionType === 'login') {
      console.log({email, password});
    }
    if (this.submissionType === 'join') {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return;

      const user: NewUser = { firstName, lastName, email, password };

      return this.authService.register(user).subscribe(() => {
        this.toggleText();
      });
    }
  };

  toggleText() {
    this.submissionType = this.submissionType === 'login' ? 'join' : 'login';
  };
}
