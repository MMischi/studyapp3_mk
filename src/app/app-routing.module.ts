import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'create-studykit',
    loadChildren: () => import('./pages/create-studykit/create-studykit.module').then( m => m.CreateStudykitPageModule)
  },
  {
    path: 'edit-studykit/:id',
    loadChildren: () => import('./pages/create-studykit/create-studykit.module').then( m => m.CreateStudykitPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'studykit-overview',
    loadChildren: () => import('./pages/studykit-overview/studykit-overview.module').then( m => m.StudykitOverviewPageModule)
  },
  {
    path: 'simple-learn',
    loadChildren: () => import('./pages/read-studycard/read-studycard.module').then( m => m.ReadStudycardPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
