import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { QuestionsRoutingModule } from './quizzes-routing.module';
import { QuestionAnswerStoreModule } from './store/quizzes.module';
import { QuizzesService } from './services/quizzes.service';
import { ColorService } from './services/color.service';

import { QuizComponent } from './containers/quiz/quiz.component';
import { QuizSelectComponent } from './containers/quiz-select/quiz-select.component';
import { QuestionComponent } from './components/question/question.component';
import { QuizEvaluationComponent } from './containers/quiz-evaluation/quiz-evaluation.component';
import { LoadQuizzesAndQuestionsGuard } from './guards/load-quizzes-and-questions.guard';
import { AllQuestionsAnsweredGuard } from './guards/all-questions-answered.guard';
import { QuizCardComponent } from './components/quiz-card/quiz-card.component';
import { QuizEvaluationCardComponent } from './components/quiz-evaluation-card/quiz-evaluation-card.component';
import { QuizEvaluationQuestionsListComponent } from './components/quiz-evaluation-questions-list/quiz-evaluation-questions-list.component';


@NgModule({
  imports: [
    CommonModule,

    SharedModule,

    QuestionsRoutingModule,
    QuestionAnswerStoreModule,
  ],
  declarations: [
    QuizSelectComponent,
    QuizComponent,
    QuestionComponent,
    QuizEvaluationComponent,
    QuizCardComponent,
    QuizEvaluationCardComponent,
    QuizEvaluationQuestionsListComponent,
  ],
  providers: [
    QuizzesService,
    ColorService,
    LoadQuizzesAndQuestionsGuard,
    AllQuestionsAnsweredGuard,
  ]
})
export class QuizzesModule { }
