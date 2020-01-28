import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'quizzes',
    loadChildren: () => import('./quizzes/quizzes.module').then(m => m.QuizzesModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'quizzes/select',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
