import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateStudykitPage } from './create-studykit.page';

const routes: Routes = [
  {
    path: '',
    component: CreateStudykitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateStudykitPageRoutingModule {}
