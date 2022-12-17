import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})

export class ModalComponent implements OnInit, OnDestroy {
  constructor(public modalController: ModalController, private authService: AuthService) {}

  @ViewChild('form') form: NgForm;
  @Input() postId?: number;
  @Input() content?: string;

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

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  };

  onPost() {
    if (!this.form.valid) return;
    const body = this.form.value['body'];
    this.modalController.dismiss({
        post: {
          body,
        }
      },
      'post',
    );
  };

  ngOnDestroy(): void {
    this.userImagePathSubscription.unsubscribe();
  };

}
