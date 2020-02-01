import { Injectable } from '@angular/core';

import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';

import { StoreService } from '../../store/app-store.service';
import { AppState } from '../../store/app.reducers';
import {
  quizzesFeatureName,
  QuizzesAppState,
  QuizState,
  quizAdapter,
  selectQuizzesState,
  selectQuizzesIsLoaded, selectQuizzesIsLoading, selectQuizzesLoadingError, selectSelectedQuizId, selectSelectedQuestionIndex,
  selectSeed,
  selectAnswerIsSubmittingFromQuizState, selectAnswersFromQuizState, selectAnswerSubmittingErrorFromQuizState,
} from './quizzes.state';
import {
  LoadQuizzesAndQuestionsListAction,
  SubmitAnswerAction, ClearAnswersAction,
} from './quizzes.actions';
import { SubmitAnswerPayload } from './quizzes.payloads';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { AnswerModel } from '../models/answer.model';


@Injectable()
export class QuizzesStoreService extends StoreService {
  private quizzesAppState = createFeatureSelector<QuizzesAppState>(quizzesFeatureName);

  private quizzesState = createSelector(this.quizzesAppState, selectQuizzesState);
  private quizzesSelectors = quizAdapter.getSelectors(this.quizzesState);
  private quizzesIsLoaded = createSelector(this.quizzesAppState, selectQuizzesIsLoaded);
  private quizzesIsLoading = createSelector(this.quizzesAppState, selectQuizzesIsLoading);
  private quizzesLoadingError = createSelector(this.quizzesAppState, selectQuizzesLoadingError);
  private quizzesSelectedQuizId = createSelector(this.quizzesAppState, selectSelectedQuizId);
  private quizzesSelectedQuestionIndex = createSelector(this.quizzesAppState, selectSelectedQuestionIndex);

  private seed = createSelector(this.quizzesAppState, selectSeed);


  constructor(protected store: Store<AppState>) {
    super();
  }


  dispatchLoadQuizzesListActionIfNotLoadedYet(): void {
    const quizzesNotLoadedYet$: Observable<{ [name: string]: boolean }> = combineLatest([
      this.getQuizzesIsLoaded(),
      this.getQuizzesIsLoading()
    ])
      .pipe(
        map(
          ([quizzesIsLoaded, quizzesIsLoading]: [boolean, boolean]) => {
            return {
              quizzesIsLoaded,
              quizzesIsLoading,
            };
          }
        ),
        filter((loadingState: { [name: string]: boolean }) => !loadingState.quizzesIsLoaded && !loadingState.quizzesIsLoading)
      );

    combineLatest([
      quizzesNotLoadedYet$,
      this.getSeed(),
    ])
      .pipe(
        map(
          ([_, seed]: [any, string]) => seed
        ),
        take(1)
      )
      .subscribe((seed: string) => this.dispatchAction(new LoadQuizzesAndQuestionsListAction(seed)));
  }


  dispatchSubmitAnswerAction(submitAnswerPayload: SubmitAnswerPayload): void {
    this.dispatchAction(new SubmitAnswerAction(submitAnswerPayload));
  }

  dispatchClearAnswersAction(quiz: Quiz): void {
    this.dispatchAction(new ClearAnswersAction({ quizId: quiz.id }));
  }


  getSeed(): Observable<string> {
    return this.store.select<string>(this.seed);
  }


  getQuizzesIsLoaded(): Observable<boolean> {
    return this.store.select<boolean>(this.quizzesIsLoaded);
  }

  getQuizzesIsLoading(): Observable<boolean> {
    return this.store.select<boolean>(this.quizzesIsLoading);
  }

  private getQuizStatesList(): Observable<QuizState[]> {
    return this.store.select<QuizState[]>(this.quizzesSelectors.selectAll);
  }

  getQuizStatesDict(): Observable<Dictionary<QuizState>> {
    return this.store.select<Dictionary<QuizState>>(this.quizzesSelectors.selectEntities);
  }

  getSelectedQuizId(): Observable<string> {
    return this.store.select<string>(this.quizzesSelectedQuizId);
  }

  getSelectedQuestionIndex(): Observable<number> {
    return this.store.select<number>(this.quizzesSelectedQuestionIndex);
  }

  getQuizzes(): Observable<Quiz[]> {
    return this.getQuizStatesList().pipe(
        map((quizStates: QuizState[]) =>
          quizStates
            .map((quizState: QuizState) => quizState.quiz)
        )
      );
  }

  getQuizzesAnswerStateDict(): Observable<Dictionary<number>> {
    return this.getQuizStatesList().pipe(
        map((quizStates: QuizState[]) =>
          quizStates.reduce((quizzesAnswerStateDict: Dictionary<number>, quizState: QuizState) => {
            let quizAnswerState: number;
            const missingAnswerIndices: number[] = quizState.quiz.questions
              .map((question: Question, index: number) => quizState.answers.answers[question.id] ? -1 : index)
              .filter((missingAnswerIndex: number) => missingAnswerIndex !== -1);
            if (missingAnswerIndices.length > 0) {
              // not all questions answered
              quizAnswerState = missingAnswerIndices[0];
            } else {
              // all questions answered
              quizAnswerState = Number.POSITIVE_INFINITY;
            }
            quizzesAnswerStateDict[quizState.quiz.id] = quizAnswerState;
            return quizzesAnswerStateDict;
          }, {})
        )
      );
  }

  getQuizzesLoadingError(): Observable<string> {
    return this.store.select<string>(this.quizzesLoadingError);
  }

  private getSelectedQuizState(): Observable<QuizState> {
    return combineLatest([
      this.getQuizStatesDict(),
      this.getSelectedQuizId()
    ])
      .pipe(
        map(
          ([entities, selectedQuizId]: [Dictionary<QuizState>, string]) => entities[selectedQuizId]
        ),
        filter((quizState: QuizState) => quizState !== undefined)
      );
  }

  getSelectedQuiz(): Observable<Quiz> {
    return this.getSelectedQuizState().pipe(
        map((quizState: QuizState) => quizState.quiz)
      );
  }


  getSelectedQuizQuestions(): Observable<Question[]> {
    return this.getSelectedQuizState().pipe(
        map((quizState: QuizState) => quizState.quiz.questions)
      );
  }

  getSelectedQuizSelectedQuestion(): Observable<Question> {
    return combineLatest([
      this.getSelectedQuizQuestions(),
      this.getSelectedQuestionIndex()
    ])
      .pipe(
        map(
          ([questions, selectedQuestionIndex]: [Question[], number]) =>
            questions[selectedQuestionIndex]
        )
      );
  }

  getSelectedQuizTotalNumberOfQuestions(): Observable<number> {
    return this.getSelectedQuizQuestions().pipe(
        map((questions: Question[]) => questions.length)
      );
  }


  getSelectedQuizAnswerIsSubmitting(): Observable<boolean> {
    return this.getSelectedQuizState().pipe(
        map((quizState: QuizState) => selectAnswerIsSubmittingFromQuizState(quizState))
      );
  }

  getSelectedQuizAnswersDict(): Observable<Dictionary<AnswerModel>> {
    return this.getSelectedQuizState().pipe(
        map((quizState: QuizState) => selectAnswersFromQuizState(quizState))
      );
  }

  getSelectedQuizAnswerForSelectedQuestion(): Observable<AnswerModel> {
    return combineLatest([
      this.getSelectedQuizQuestions(),
      this.getSelectedQuizAnswersDict(),
      this.getSelectedQuestionIndex()
    ])
      .pipe(
        map(
          ([questions, answers, selectedQuestionIndex]: [Question[], Dictionary<AnswerModel>, number]) =>
            answers[questions[selectedQuestionIndex].id]
        )
      );
  }

  getSelectedQuizAnswerSubmittingError(): Observable<string> {
    return this.getSelectedQuizState().pipe(
        map((quizState: QuizState) => selectAnswerSubmittingErrorFromQuizState(quizState))
      );
  }


  getNumberOfCorrectlyAnsweredQuestions(): Observable<number> {
    return combineLatest([
      this.getSelectedQuizQuestions(),
      this.getSelectedQuizAnswersDict()
    ])
      .pipe(
        map(
          ([questions, answers]: [Question[], Dictionary<AnswerModel>]) =>
            questions
              .map((question: Question) => (answers[question.id] || { isCorrect: false }).isCorrect)
              .filter((isCorrectlyAnswered: boolean) => isCorrectlyAnswered)
              .length
        )
      );
  }
}
