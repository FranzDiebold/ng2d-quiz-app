import { NgRxAction } from '../../store/ngrx-action';

import {
  QuizIdPayload,
  SetSelectedQuestionIndexPayload,
  SubmitAnswerPayload, SubmitAnswerSucceededPayload, SubmitAnswerFailedPayload,
} from './quizzes.payloads';
import { Quiz } from '../models/quiz.model';


export const SET_SEED_ACTION = '[Seed] Set';

export class SetSeedAction extends NgRxAction<string> {
  readonly type = SET_SEED_ACTION;
}


export enum QuizAndQuestionsActions {
  LOAD_QUIZZES_AND_QUESTIONS_LIST = '[Quizzes and Questions] Load List',
  LOAD_QUIZZES_AND_QUESTIONS_LIST_SUCCEEDED = '[Quizzes and Questions] Load List Succeeded',
  LOAD_QUIZZES_AND_QUESTIONS_LIST_FAILED = '[Quizzes and Questions] Load List Failed',
  SET_SELECTED_QUIZ_ID = '[Quizzes and Questions] Set Selected Quiz Id',
  SET_SELECTED_QUESTION_INDEX = '[Quizzes and Questions] Set Selected Question Index',
}

export class LoadQuizzesAndQuestionsListAction extends NgRxAction<string> {
  readonly type = QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST;
}

export class LoadQuizzesAndQuestionsListSucceededAction extends NgRxAction<Quiz[]> {
  readonly type = QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST_SUCCEEDED;
}

export class LoadQuizzesAndQuestionsListFailedAction extends NgRxAction<string> {
  readonly type = QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST_FAILED;
}

export class SetSelectedQuizIdAction extends NgRxAction<string> {
  readonly type = QuizAndQuestionsActions.SET_SELECTED_QUIZ_ID;
}

export class SetSelectedQuestionIndexAction extends NgRxAction<SetSelectedQuestionIndexPayload> {
  readonly type = QuizAndQuestionsActions.SET_SELECTED_QUESTION_INDEX;
}

export type QuizAndQuestionAction = LoadQuizzesAndQuestionsListAction | LoadQuizzesAndQuestionsListSucceededAction |
  LoadQuizzesAndQuestionsListFailedAction | SetSelectedQuizIdAction | SetSelectedQuestionIndexAction;


export enum AnswerActions {
  SUBMIT_ANSWER = '[Answer] Submit',
  SUBMIT_ANSWER_SUCCEEDED = '[Answer] Submit Succeeded',
  SUBMIT_ANSWER_FAILED = '[Answer] Submit Failed',
  CLEAR_ANSWERS = '[Answers] Clear',
}

export class SubmitAnswerAction extends NgRxAction<SubmitAnswerPayload> {
  readonly type = AnswerActions.SUBMIT_ANSWER;
}

export class SubmitAnswerSucceededAction extends NgRxAction<SubmitAnswerSucceededPayload> {
  readonly type = AnswerActions.SUBMIT_ANSWER_SUCCEEDED;
}

export class SubmitAnswerFailedAction extends NgRxAction<SubmitAnswerFailedPayload> {
  readonly type = AnswerActions.SUBMIT_ANSWER_FAILED;
}

export class ClearAnswersAction extends NgRxAction<QuizIdPayload> {
  readonly type = AnswerActions.CLEAR_ANSWERS;
}

export type AnswerAction = SubmitAnswerAction | SubmitAnswerSucceededAction | SubmitAnswerFailedAction | ClearAnswersAction;


export type QuizzesAction = SetSeedAction | QuizAndQuestionAction | AnswerAction;
