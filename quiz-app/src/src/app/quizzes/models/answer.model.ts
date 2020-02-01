import { Answer } from './answer.type';

export interface AnswerModel {
  submittedAnswer: Answer;
  correctAnswer: Answer;
  isCorrect: boolean;
  answerDescription?: string;
}
