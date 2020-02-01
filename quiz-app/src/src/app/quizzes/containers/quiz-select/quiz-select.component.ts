import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity/src/models';

import { Quiz } from '../../models/quiz.model';
import { QuizzesStoreService } from '../../store/quizzes-store.service';


@Component({
  selector: 'app-quiz-select',
  templateUrl: './quiz-select.component.html',
  styleUrls: ['./quiz-select.component.scss']
})
export class QuizSelectComponent implements OnInit {
  isLoading$: Observable<boolean>;
  quizzes$: Observable<Quiz[]>;
  quizzesAnswerStateDict$: Observable<Dictionary<number>>;
  loadingError$: Observable<string>;

  constructor(private quizzesStoreService: QuizzesStoreService) {}

  ngOnInit() {
    this.isLoading$ = this.quizzesStoreService.getQuizzesIsLoading();
    this.quizzes$ = this.quizzesStoreService.getQuizzes();
    this.quizzesAnswerStateDict$ = this.quizzesStoreService.getQuizzesAnswerStateDict();
    this.loadingError$ = this.quizzesStoreService.getQuizzesLoadingError();
  }

  retryLoading(): void {
    this.quizzesStoreService.dispatchLoadQuizzesListActionIfNotLoadedYet();
  }
}
