import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudykitOverviewPage } from './studykit-overview.page';

const routes: Routes = [
  {
    path: '',
    component: StudykitOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudykitOverviewPageRoutingModule {}
