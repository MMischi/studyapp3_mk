import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnStudycardPageRoutingModule } from './learn-studycard-routing.module';

import { LearnStudycardPage } from './learn-studycard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearnStudycardPageRoutingModule
  ],
  declarations: [LearnStudycardPage]
})
export class LearnStudycardPageModule {}
