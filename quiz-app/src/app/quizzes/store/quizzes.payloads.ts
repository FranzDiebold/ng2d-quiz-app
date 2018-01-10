import { Answer } from '../models/answer.type';
import { AnswerModel } from '../models/answer.model';


export interface QuizIdPayload {
  quizId: string;
}


export interface SetSelectedQuestionIndexPayload extends QuizIdPayload {
  selectedQuestionIndex: number;
}


export interface SubmitAnswerModel extends QuizIdPayload {
  questionId: string;
  answer: Answer;
}

export interface SubmitAnswerPayload extends SubmitAnswerModel {
  seed: string;
}

export interface SubmitAnswerSucceededPayload extends QuizIdPayload {
  questionId: string;
  answer: AnswerModel;
}

export interface SubmitAnswerFailedPayload extends QuizIdPayload {
  error: string;
}
