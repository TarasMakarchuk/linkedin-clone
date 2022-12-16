import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit, OnDestroy {
  @Output() create: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController, private authService: AuthService) { }

  userImagePath: string;
  private userImagePathSubscription: Subscription;

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userImagePath.subscribe(
      (imagePath: string) => {
        this.userImagePath = imagePath;
      });
  };

  async presentModal() {
    console.log('CREATE POST');
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'custom-class-modal',
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data) return;
    this.create.emit(data.post.body);
  };

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
  };

}
