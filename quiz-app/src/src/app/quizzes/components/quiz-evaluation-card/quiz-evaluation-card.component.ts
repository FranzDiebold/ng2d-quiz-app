import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ColorService } from '../../services/color.service';
import { Quiz } from '../../models/quiz.model';


@Component({
  selector: 'app-quiz-evaluation-card',
  templateUrl: './quiz-evaluation-card.component.html',
  styleUrls: ['./quiz-evaluation-card.component.scss']
})
export class QuizEvaluationCardComponent {
  @Input() quiz: Quiz;
  @Input() numberOfCorrectlyAnsweredQuestions: number;
  @Input() totalNumberOfQuestions: number;
  @Output() restartQuiz: EventEmitter<Quiz> = new EventEmitter<Quiz>(false);

  constructor(private colorService: ColorService) {}

  get percentageOfCurrectlyAnsweredQuestions(): number {
    return Math.ceil(100 * this.numberOfCorrectlyAnsweredQuestions / this.totalNumberOfQuestions);
  }

  getTransparentColor(alpha: number): string {
    return this.colorService.hexToRgba(this.quiz.color, alpha);
  }

  onRestart(): void {
    this.restartQuiz.emit(this.quiz);
  }
}
