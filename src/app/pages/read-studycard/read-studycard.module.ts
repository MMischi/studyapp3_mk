import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReadStudycardPageRoutingModule } from './read-studycard-routing.module';

import { ReadStudycardPage } from './read-studycard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReadStudycardPageRoutingModule
  ],
  declarations: [ReadStudycardPage]
})
export class ReadStudycardPageModule {}
