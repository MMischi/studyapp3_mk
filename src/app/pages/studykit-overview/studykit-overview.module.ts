import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudykitOverviewPageRoutingModule } from './studykit-overview-routing.module';

import { StudykitOverviewPage } from './studykit-overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudykitOverviewPageRoutingModule
  ],
  declarations: [StudykitOverviewPage]
})
export class StudykitOverviewPageModule {}
