import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { quizzesFeatureName } from './quizzes.state';
import { quizzesReducer } from './quizzes.reducers';
import { QuestionAnswerEffects } from './quizzes.effects';
import { QuizzesStoreService } from './quizzes-store.service';


@NgModule({
  imports: [
    StoreModule.forFeature(quizzesFeatureName, quizzesReducer),
    EffectsModule.forFeature([QuestionAnswerEffects]),
  ],
  exports: [
    StoreModule,
    EffectsModule,
  ],
  providers: [
    QuizzesStoreService,
  ],
})
export class QuestionAnswerStoreModule {}
