import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudykitDetailPage } from './studykit-detail.page';

const routes: Routes = [
  {
    path: '',
    component: StudykitDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudykitDetailPageRoutingModule {}
