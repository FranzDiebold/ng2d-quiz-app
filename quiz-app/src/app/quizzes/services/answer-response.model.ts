import { Answer } from '../models/answer.type';

export interface AnswerResponse {
  isCorrect: boolean;
  correctAnswer: Answer;
  answerDescription?: string;
}
