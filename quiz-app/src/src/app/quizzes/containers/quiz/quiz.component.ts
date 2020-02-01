import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, combineLatest } from 'rxjs';
import { map, filter, throttleTime, switchMap } from 'rxjs/operators';
import { Dictionary } from '@ngrx/entity/src/models';

import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';
import { SubmitAnswerModel, SubmitAnswerPayload } from '../../store/quizzes.payloads';
import { QuizzesStoreService } from '../../store/quizzes-store.service';
import { QuizState } from '../../store/quizzes.state';


@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quiz$: Observable<Quiz>;
  isLoading$: Observable<boolean>;
  loadingError$: Observable<string>;

  questionIndex$: Observable<number>;
  selectedQuestion$: Observable<Question>;
  totalNumberOfQuestions$: Observable<number>;

  isSubmitting$: Observable<boolean>;
  answerForSelectedQuestion$: Observable<AnswerModel>;
  submittingError$: Observable<string>;

  submitAnswer$: Subject<SubmitAnswerModel> = new Subject<SubmitAnswerModel>();

  constructor(private quizzesStoreService: QuizzesStoreService, private router: Router) {}

  ngOnInit() {
    this.quiz$ = this.quizzesStoreService.getSelectedQuiz();
    this.isLoading$ = this.quizzesStoreService.getQuizzesIsLoading();
    this.loadingError$ = this.quizzesStoreService.getQuizzesLoadingError();

    this.questionIndex$ = this.quizzesStoreService.getSelectedQuestionIndex();
    this.selectedQuestion$ = this.quizzesStoreService.getSelectedQuizSelectedQuestion();
    this.totalNumberOfQuestions$ = this.quizzesStoreService.getSelectedQuizTotalNumberOfQuestions();

    this.isSubmitting$ = this.quizzesStoreService.getSelectedQuizAnswerIsSubmitting();
    this.answerForSelectedQuestion$ = this.quizzesStoreService.getSelectedQuizAnswerForSelectedQuestion();
    this.submittingError$ = this.quizzesStoreService.getSelectedQuizAnswerSubmittingError();

    combineLatest([
      this.submitAnswer$,
      this.quizzesStoreService.getSeed()]
    )
      .pipe(
        map(
          ([submitAnswer, seed]: [SubmitAnswerModel, string]) =>
            Object.assign(submitAnswer, { seed })
          )
      )
      .subscribe((submitAnswerPayload: SubmitAnswerPayload) =>
        this.quizzesStoreService.dispatchSubmitAnswerAction(submitAnswerPayload));

    const snackBarDuration = 4000;
    this.submittingError$.pipe(
        filter((error: string) => !!error),
        throttleTime(snackBarDuration)
      )
      .subscribe((error: string) => console.log(error)); // this.snackBar.open(error, 'Too bad!', { duration: snackBarDuration, })

    const selectedQuizId$: Observable<string> = this.quizzesStoreService.getQuizzesIsLoaded()
      .pipe(
        filter((quizzesIsLoaded: boolean) => quizzesIsLoaded),
        switchMap(() =>
          this.quizzesStoreService.getSelectedQuizId()
            .pipe(
              filter((selectedQuizId: string) => selectedQuizId !== undefined)
            )
        )
      );
    combineLatest([
        selectedQuizId$,
        this.quizzesStoreService.getQuizStatesDict(),
      ])
        .pipe(
          map(([selectedQuizId, quizStatesDict]: [string, Dictionary<QuizState>]) => (selectedQuizId in quizStatesDict)),
          filter((quizExists: boolean) => !quizExists),
        )
      .subscribe(() => this.router.navigate(['/quizzes', 'select']));

    this.quizzesStoreService.getQuizzesIsLoaded()
      .pipe(
        filter((quizzesIsLoaded: boolean) => quizzesIsLoaded),
        switchMap(() =>
        combineLatest([
          this.quiz$,
          this.questionIndex$,
          this.quizzesStoreService.getQuizzesAnswerStateDict(),
        ])
          .pipe(
            map(
              ([quiz, questionIndex, quizzesAnswerStateDict]: [Quiz, number, Dictionary<number>]) => {
                const currentQuestionIndex = quizzesAnswerStateDict[quiz.id];
                if (questionIndex > currentQuestionIndex) {
                  return {
                    quizId: quiz.id,
                    questionIndexToRedirect: currentQuestionIndex,
                  };
                } else {
                  return null;
                }
              }
            ),
            filter((redirectState: {[name: string]: any}) => redirectState !== null)
          )
        )
      )
      .subscribe((redirectState: {[name: string]: any}) =>
        this.router.navigate(['/quizzes', redirectState.quizId, redirectState.questionIndexToRedirect])
      );
  }

  restartQuiz(quiz): void {
    this.quizzesStoreService.dispatchClearAnswersAction(quiz);
    this.router.navigate(['/quizzes', quiz.id, 0]);
  }
}
