import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';

import { QuizzesStoreService } from '../store/quizzes-store.service';


@Injectable()
export class AllQuestionsAnsweredGuard implements CanActivate {
  constructor(
    private quizzesStoreService: QuizzesStoreService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const quizId = route.params['quiz_id'];

    return this.quizzesStoreService.getQuizzesAnswerStateDict().pipe(
        map((quizzesAnswerStateDict: Dictionary<number>) => quizzesAnswerStateDict[quizId]),
        map((currentQuestionIndex: number) => {
          if (currentQuestionIndex === undefined) {
            currentQuestionIndex = 0;
          }
          if (currentQuestionIndex < Number.POSITIVE_INFINITY) {
            this.router.navigate(['/quizzes', quizId, currentQuestionIndex]);
            return false;
          } else {
            return true;
          }
        })
      );
  }
}
