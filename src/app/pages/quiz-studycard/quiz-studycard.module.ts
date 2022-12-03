import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuizStudycardPageRoutingModule } from './quiz-studycard-routing.module';

import { QuizStudycardPage } from './quiz-studycard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuizStudycardPageRoutingModule
  ],
  declarations: [QuizStudycardPage]
})
export class QuizStudycardPageModule {}
