import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Quiz } from '../../models/quiz.model';
import { Question } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';
import { Answer } from '../../models/answer.type';
import { SubmitAnswerModel } from '../../store/quizzes.payloads';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnChanges {
  @Input() quiz: Quiz;
  @Input() question: Question;
  @Input() questionIndex: number;
  @Input() totalNumberOfQuestions: number;
  @Input() isSubmitting: boolean;
  @Input() submittingError: string;
  @Input() answer: AnswerModel;
  @Input() isEvaluation: boolean;
  @Output() submitAnswer: EventEmitter<SubmitAnswerModel> = new EventEmitter<SubmitAnswerModel>(false);
  @Output() restartQuiz: EventEmitter<Quiz> = new EventEmitter<Quiz>(false);

  answerForm: AbstractControl = new FormGroup({
    answer: new FormControl(),
  });

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnChanges(changes: {[propKey: string]: SimpleChange}): void {
    if (changes['question']) {
      switch (this.question.type) {
        case 'SINGLE_CHOICE':
          this.answerForm = this.formBuilder.group({
            answer: [null, Validators.required],
          });
          break;
        case 'MULTIPLE_CHOICE':
          const multipleChoiceValidator = (control: AbstractControl) =>
            control.value.reduce(
              (valid: boolean, currentValue: boolean) => valid || currentValue
              , false
            ) ? null : {'answers': 'At least one answer needs to be checked!'};
          this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array(this.question.shuffledAnswers
                .map((answer: string) => this.formBuilder.control(false)),
              multipleChoiceValidator
            ),
          });
          break;
        case 'SORT':
          this.answerForm = this.formBuilder.group({
            answers: this.formBuilder.array(this.question.shuffledAnswers
              .map((answer: string, index: number) => this.formBuilder.control(index))
            ),
          });
          break;
        case 'TEXT':
          this.answerForm = this.formBuilder.group({
            answer: [null, Validators.required],
          });
          break;
      }

      if (!this.isEvaluation) {
        const questionTextElement = document.getElementById('question-top');
        questionTextElement.scrollIntoView();
      }
    }
  }

  onSubmit(): void {
    let answer: Answer = null;
    switch (this.question.type) {
      case 'SINGLE_CHOICE':
        answer = this.answerForm.value.answer;
        break;
      case 'MULTIPLE_CHOICE':
        answer = this.answerForm.value.answers
          .map((isChecked: boolean, index: number) => isChecked ? index : -1)
          .filter((checkedIndex: number) => checkedIndex >= 0);
        break;
      case 'SORT':
        answer = this.answerForm.value.answers;
        break;
      case 'TEXT':
        answer = this.answerForm.value.answer;
        break;
    }
    const submitAnswer: SubmitAnswerModel = {
      quizId: this.quiz.id,
      questionId: this.question.id,
      answer: answer,
    };
    this.submitAnswer.emit(submitAnswer);
  }

  previousQuestion(isClick?: boolean): void {
    if (isClick || this.answer) {
      this.router.navigate(['/quizzes', this.quiz.id, Math.max(this.questionIndex - 1, 0)]);
    }
  }

  nextQuestion(): void {
    this.router.navigate(['/quizzes', this.quiz.id, Math.min(this.questionIndex + 1, this.totalNumberOfQuestions - 1)]);
  }

  evaluation(): void {
    this.router.navigate(['/quizzes', this.quiz.id, 'evaluation']);
  }

  onRestart(): void {
    this.restartQuiz.emit(this.quiz);
  }

}
