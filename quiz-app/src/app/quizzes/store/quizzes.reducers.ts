import { Dictionary } from '@ngrx/entity/src/models';

import {
  QuizzesAppState, initialQuizzesAppState,
  QuizState,
  initialAnswersState, QuizzesState,
} from './quizzes.state';
import {
  QuizzesAction,
  SET_SEED_ACTION,
  QuizAndQuestionsActions,
  AnswerActions,
} from './quizzes.actions';
import {
  QuizIdPayload,
} from './quizzes.payloads';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';
import { ColorService } from '../services/color.service';


export function quizzesReducer(
  state: QuizzesAppState = initialQuizzesAppState,
  action: QuizzesAction
): QuizzesAppState {
  switch (action.type) {
    case SET_SEED_ACTION:
      return {
        ...state,
        seed: action.payload,
      };

    case QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          isLoading: true,
          loadingError: undefined,
        }
      };
    case QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST_SUCCEEDED:
      const entities = (<Quiz[]> action.payload).reduce((entitiesMap: Dictionary<QuizState>, quiz: Quiz) => {
        entitiesMap[quiz.id] = {
          quiz: {
            ...quiz,
            questions: quiz.questions.map((question: Question) => {
              const color = question.color || ColorService.getRandomColor();
              return {
                ...question,
                color: color,
                textColor: ColorService.getInvertTextColor(color),
              };
            }),
            color: quiz.color || ColorService.getRandomColor(),
          },
          answers: initialAnswersState,
        };
        return entitiesMap;
      }, {});
      const ids = (<Quiz[]>action.payload).map((quiz: Quiz) => quiz.id);

      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          isLoaded: true,
          isLoading: false,
          ids: ids,
          entities: entities,
          loadingError: undefined,
        },
      };
    case QuizAndQuestionsActions.LOAD_QUIZZES_AND_QUESTIONS_LIST_FAILED:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          isLoading: false,
          loadingError: action.payload,
        },
      };
    case QuizAndQuestionsActions.SET_SELECTED_QUIZ_ID:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          selectedQuizId: action.payload,
        },
      };
    case QuizAndQuestionsActions.SET_SELECTED_QUESTION_INDEX:
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          selectedQuizId: action.payload.quizId,
          selectedQuestionIndex: action.payload.selectedQuestionIndex,
        },
      };

    case AnswerActions.SUBMIT_ANSWER:
      return {
        ...state,
        quizzes: getUpdatedQuizzesStateForAnswers(state.quizzes, action.payload, {
          isSubmitting: true,
        }),
      };
    case AnswerActions.SUBMIT_ANSWER_SUCCEEDED:
      return {
        ...state,
        quizzes: getUpdatedQuizzesStateForAnswers(state.quizzes, action.payload, {
          isSubmitting: false,
          answers: {
            ...state.quizzes.entities[action.payload.quizId].answers.answers,
            [action.payload.questionId]: action.payload.answer,
          },
        }),
      };
    case AnswerActions.SUBMIT_ANSWER_FAILED:
      return {
        ...state,
        quizzes: getUpdatedQuizzesStateForAnswers(state.quizzes, action.payload, {
          isSubmitting: false,
          submittingError: action.payload.error,
        }),
      };
    case AnswerActions.CLEAR_ANSWERS:
      return {
        ...state,
        quizzes: getUpdatedQuizzesStateForAnswers(state.quizzes, action.payload, {
          answers: {},
        }),
      };

    default: {
      return state;
    }
  }
}

function getUpdatedQuizzesStateForAnswers(quizzesState: QuizzesState, payload: QuizIdPayload, stateChange: any): QuizzesState {
  return {
    ...quizzesState,
    entities: {
      ...quizzesState.entities,
      [payload.quizId]: {
        ...quizzesState.entities[payload.quizId],
        answers: {
          ...quizzesState.entities[payload.quizId].answers,
          ...stateChange,
        },
      },
    },
  };
}
