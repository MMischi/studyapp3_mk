import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateStudykitPageRoutingModule } from './create-studykit-routing.module';

import { CreateStudykitPage } from './create-studykit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateStudykitPageRoutingModule
  ],
  declarations: [CreateStudykitPage]
})
export class CreateStudykitPageModule {}
