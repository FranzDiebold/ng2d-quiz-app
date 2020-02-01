import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ColorService } from '../../services/color.service';
import { Quiz } from '../../models/quiz.model';


@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss']
})
export class QuizCardComponent {
  POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
  @Input() quiz: Quiz;
  @Input() currentQuestionIndex: number;

  constructor(private router: Router, private colorService: ColorService) {}

  getTransparentColor(alpha: number): string {
    const color = (this.currentQuestionIndex < Number.POSITIVE_INFINITY) ? this.quiz.color : '#000000';
    return this.colorService.hexToRgba(color, alpha);
  }

  onClick(): void {
    if (this.currentQuestionIndex < Number.POSITIVE_INFINITY) {
      // start or continue
      this.router.navigate(['/quizzes', this.quiz.id, this.currentQuestionIndex]);
    } else if (this.currentQuestionIndex === Number.POSITIVE_INFINITY) {
      // evaluation
      this.router.navigate(['/quizzes', this.quiz.id, 'evaluation']);
    }
  }
}
