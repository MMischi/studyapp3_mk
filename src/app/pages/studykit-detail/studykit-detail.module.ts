import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudykitDetailPageRoutingModule } from './studykit-detail-routing.module';

import { StudykitDetailPage } from './studykit-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudykitDetailPageRoutingModule
  ],
  declarations: [StudykitDetailPage]
})
export class StudykitDetailPageModule {}
