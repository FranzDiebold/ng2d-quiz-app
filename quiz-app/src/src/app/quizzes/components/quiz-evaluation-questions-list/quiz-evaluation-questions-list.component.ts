import { Component, Input } from '@angular/core';
import { Dictionary } from '@ngrx/entity/src/models';

import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';


@Component({
  selector: 'app-quiz-evaluation-questions-list',
  templateUrl: './quiz-evaluation-questions-list.component.html',
  styleUrls: ['./quiz-evaluation-questions-list.component.scss']
})
export class QuizEvaluationQuestionsListComponent {
  @Input() quiz: Quiz;
  @Input() questions: Question[];
  @Input() answersDict: any;
  @Input() totalNumberOfQuestions: number;

  filterValue: string;

  constructor() {
    this.filterValue = 'all';
  }

  setFilterValue(newFilterValue: string): void {
    this.filterValue = newFilterValue;
  }
}
