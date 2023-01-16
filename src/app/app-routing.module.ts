import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {
  redirectUnauthorizedTo, 
  redirectLoggedInTo,
  canActivate
} from '@angular/fire/auth-guard'

const redirectUnauthorizedToRegister = () => redirectUnauthorizedTo(['register']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'create-studykit',
    loadChildren: () => import('./pages/create-studykit/create-studykit.module').then( m => m.CreateStudykitPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'edit-studykit/:id',
    loadChildren: () => import('./pages/create-studykit/create-studykit.module').then( m => m.CreateStudykitPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'studykit-overview',
    loadChildren: () => import('./pages/studykit-overview/studykit-overview.module').then( m => m.StudykitOverviewPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'read-studycard/:id',
    loadChildren: () => import('./pages/read-studycard/read-studycard.module').then( m => m.ReadStudycardPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'learn-studycard/:id',
    loadChildren: () => import('./pages/learn-studycard/learn-studycard.module').then( m => m.LearnStudycardPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'quiz-studycard/:id',
    loadChildren: () => import('./pages/quiz-studycard/quiz-studycard.module').then( m => m.QuizStudycardPageModule),
    ...canActivate(redirectUnauthorizedToRegister),
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'studykit-world',
    loadChildren: () => import('./pages/studykit-world/studykit-world.module').then( m => m.StudykitWorldPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
