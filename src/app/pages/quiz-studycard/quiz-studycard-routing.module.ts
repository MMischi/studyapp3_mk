import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuizStudycardPage } from './quiz-studycard.page';

const routes: Routes = [
  {
    path: '',
    component: QuizStudycardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuizStudycardPageRoutingModule {}
