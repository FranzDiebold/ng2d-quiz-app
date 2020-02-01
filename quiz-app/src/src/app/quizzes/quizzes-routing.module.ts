import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuizSelectComponent } from './containers/quiz-select/quiz-select.component';
import { QuizComponent } from './containers/quiz/quiz.component';
import { QuizEvaluationComponent } from './containers/quiz-evaluation/quiz-evaluation.component';
import { LoadQuizzesAndQuestionsGuard } from './guards/load-quizzes-and-questions.guard';
import { AllQuestionsAnsweredGuard } from './guards/all-questions-answered.guard';

const routes: Routes = [
  {
    path: 'select',
    component: QuizSelectComponent,
    canActivate: [LoadQuizzesAndQuestionsGuard],
  },
  {
    path: ':quiz_id/evaluation',
    component: QuizEvaluationComponent,
    canActivate: [LoadQuizzesAndQuestionsGuard, AllQuestionsAnsweredGuard],
  },
  {
    path: ':quiz_id/:question_index',
    component: QuizComponent,
    canActivate: [LoadQuizzesAndQuestionsGuard],
  },
  {
    path: '**',
    redirectTo: 'select',
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class QuestionsRoutingModule { }
