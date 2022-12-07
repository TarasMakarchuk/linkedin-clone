import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})

export class ModalComponent implements OnInit {
  constructor(public modalController: ModalController) { }

  @ViewChild('form') form: NgForm;
  @Input() postId?: number;

  ngOnInit() {}

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

}
