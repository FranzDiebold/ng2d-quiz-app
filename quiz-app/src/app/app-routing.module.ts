import { NgModule } from '@angular/core';

import {RouterModule, Routes} from '@angular/router';


const routes: Routes = [
  {
    path: 'quizzes',
    loadChildren: 'app/quizzes/quizzes.module#QuizzesModule',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'quizzes/select',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {}
