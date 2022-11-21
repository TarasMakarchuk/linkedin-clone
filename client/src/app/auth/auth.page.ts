import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;
  submissionType: 'login' | 'join' = 'login';
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    const { email, password, firstName, lastName } = this.form.value;
    if (!email || !password) return;
    if (this.submissionType === 'login') {
      console.log({email, password});
    }
    if (this.submissionType === 'join') {
      if (!firstName || !lastName) return;
      console.log({firstName, lastName, email, password});
    }
  };

  toggleText() {
    this.submissionType = this.submissionType === 'login' ? 'join' : 'login';
  };
}
