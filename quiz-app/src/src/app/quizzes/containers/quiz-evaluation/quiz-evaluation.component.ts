import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity/src/models';

import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';
import { QuizzesStoreService } from '../../store/quizzes-store.service';


@Component({
  selector: 'app-quiz-evaluation',
  templateUrl: './quiz-evaluation.component.html',
  styleUrls: ['./quiz-evaluation.component.scss']
})
export class QuizEvaluationComponent implements OnInit {
  quiz$: Observable<Quiz>;

  numberOfCorrectlyAnsweredQuestions$: Observable<number>;
  totalNumberOfQuestions$: Observable<number>;
  questions$: Observable<Question[]>;
  answersDict$: Observable<Dictionary<AnswerModel>>;

  constructor(private quizzesStoreService: QuizzesStoreService, private router: Router) { }

  ngOnInit() {
    this.quiz$ = this.quizzesStoreService.getSelectedQuiz();

    this.numberOfCorrectlyAnsweredQuestions$ = this.quizzesStoreService.getNumberOfCorrectlyAnsweredQuestions();
    this.totalNumberOfQuestions$ = this.quizzesStoreService.getSelectedQuizTotalNumberOfQuestions();
    this.questions$ = this.quizzesStoreService.getSelectedQuizQuestions();
    this.answersDict$ = this.quizzesStoreService.getSelectedQuizAnswersDict();
  }

  restartQuiz(quiz): void {
    this.quizzesStoreService.dispatchClearAnswersAction(quiz);
    this.router.navigate(['/quizzes', quiz.id, 0]);
  }
}
