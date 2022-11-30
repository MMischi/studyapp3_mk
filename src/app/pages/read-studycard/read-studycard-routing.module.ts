import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadStudycardPage } from './read-studycard.page';

const routes: Routes = [
  {
    path: '',
    component: ReadStudycardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadStudycardPageRoutingModule {}
