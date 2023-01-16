import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudykitWorldPage } from './studykit-world.page';

const routes: Routes = [
  {
    path: '',
    component: StudykitWorldPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudykitWorldPageRoutingModule {}
