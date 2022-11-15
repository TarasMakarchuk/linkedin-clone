import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    HeaderComponent,
    ProfileSummaryComponent,
    AdvertisingComponent,
  ]
})
export class HomePageModule {}

