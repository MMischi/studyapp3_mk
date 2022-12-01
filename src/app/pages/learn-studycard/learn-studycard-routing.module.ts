import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearnStudycardPage } from './learn-studycard.page';

const routes: Routes = [
  {
    path: '',
    component: LearnStudycardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnStudycardPageRoutingModule {}
