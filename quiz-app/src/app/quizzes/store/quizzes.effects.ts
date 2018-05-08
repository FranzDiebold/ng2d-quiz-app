import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, filter, distinctUntilChanged } from 'rxjs/operators';

import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction, RouterNavigationPayload } from '@ngrx/router-store';

import {
  QuizAndQuestionsActions, LoadQuizzesAndQuestionsListAction, LoadQuizzesAndQuestionsListSucceededAction,
  LoadQuizzesAndQuestionsListFailedAction,
  SetSelectedQuestionIndexAction,
  AnswerActions, SubmitAnswerAction, SubmitAnswerSucceededAction, SubmitAnswerFailedAction,
} from './quizzes.actions';
import {
  SubmitAnswerPayload, SubmitAnswerSucceededPayload
} from './quizzes.payloads';
import { QuizzesService } from '../services/quizzes.service';
import { AnswerResponse } from '../services/answer-response.model';
import { Quiz } from '../models/quiz.model';


@Injectable()
export class QuestionAnswerEffects {
  @Effect()
  loadQuizzesAndQuestions$: Observable<Action> = this.actions$
    .ofType(QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST)
    .pipe(
      map((action: LoadQuizzesAndQuestionsListAction) => action.payload),
      switchMap((seed: string) =>
        this.quizzesService
          .getQuizzesAndQuestions(seed)
          .pipe(
            map((quizzes: Quiz[]) => new LoadQuizzesAndQuestionsListSucceededAction(quizzes)),
            catchError((error: any) => of(new LoadQuizzesAndQuestionsListFailedAction(this.quizzesService.ERROR_MESSAGE)))
          )
      )
    );

  @Effect()
  submitAnswer$: Observable<Action> = this.actions$
    .ofType(AnswerActions.SUBMIT_ANSWER)
    .pipe(
      map((action: SubmitAnswerAction) => action.payload),
      switchMap((submitAnswerPayload: SubmitAnswerPayload) =>
        this.quizzesService
          .submitAnswer(submitAnswerPayload.quizId, submitAnswerPayload.seed, submitAnswerPayload.questionId, submitAnswerPayload.answer)
          .pipe(
            map((answerResponse: AnswerResponse) => {
              return {
                quizId: submitAnswerPayload.quizId,
                questionId: submitAnswerPayload.questionId,
                answer: Object.assign(answerResponse, {
                  submittedAnswer: submitAnswerPayload.answer,
                }),
              };
            }),
            map((responseAnswerPayload: SubmitAnswerSucceededPayload) => new SubmitAnswerSucceededAction(responseAnswerPayload)),
            catchError((error: any) => of(new SubmitAnswerFailedAction({
              quizId: submitAnswerPayload.quizId,
              error: this.quizzesService.ERROR_MESSAGE,
            })))
          )
      )
    );

  routerNavigationUpdate$: Observable<Params> = this.actions$
    .ofType(ROUTER_NAVIGATION)
    .pipe(
      map((action: RouterNavigationAction) => action.payload),
      map((routerNavigationPayload: RouterNavigationPayload<RouterStateSnapshot>) => routerNavigationPayload.routerState),
      map((routerState: RouterStateSnapshot) => routerState.root.firstChild),
      filter((firstChild: ActivatedRouteSnapshot) => !!firstChild),
      map((firstChild: ActivatedRouteSnapshot) => firstChild.firstChild),
      filter((firstChild: ActivatedRouteSnapshot) => !!firstChild),
      map((firstChild: ActivatedRouteSnapshot) => firstChild.params),
      filter((params: Params) => !!params)
    );

  @Effect()
  updateSelectedQuizIdAndSelectedQuestionIndex$: Observable<Action> = this.routerNavigationUpdate$
    .pipe(
      distinctUntilChanged(),
      map((params: Params) => {
        const quizId = params['quiz_id'];
        const questionIndex = parseInt(params['question_index'], 10) || undefined;
        return {
          quizId: quizId,
          questionIndex: questionIndex,
        };
      }),
      map((quizAndQuestionParams: any) => new SetSelectedQuestionIndexAction({
        quizId: quizAndQuestionParams.quizId,
        selectedQuestionIndex: quizAndQuestionParams.questionIndex || 0
      }))
    );

  constructor(
    private actions$: Actions,
    private quizzesService: QuizzesService,
  ) {}
}
