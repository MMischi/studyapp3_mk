import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudykitWorldPageRoutingModule } from './studykit-world-routing.module';

import { StudykitWorldPage } from './studykit-world.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudykitWorldPageRoutingModule
  ],
  declarations: [StudykitWorldPage]
})
export class StudykitWorldPageModule {}
