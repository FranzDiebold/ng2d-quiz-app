import { createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Dictionary } from '@ngrx/entity/src/models';

import { UUID } from 'angular2-uuid';

import { Quiz } from '../models/quiz.model';
import { AnswerModel } from '../models/answer.model';


export interface AnswersState {
  isSubmitting: boolean;
  submittingError?: string;
  answers: Dictionary<AnswerModel>;
}

export const initialAnswersState: AnswersState = {
  isSubmitting: false,
  answers: {},
};


export interface QuizState {
  quiz: Quiz;
  answers: AnswersState;
}


export interface QuizzesState extends EntityState<QuizState> {
  isLoaded: boolean;
  isLoading: boolean;
  loadingError?: string;
  selectedQuizId: string;
  selectedQuestionIndex: number;
}

export const quizAdapter: EntityAdapter<QuizState> = createEntityAdapter<QuizState>({
  selectId: (quizState: QuizState) => quizState.quiz.id,
  sortComparer: false,
});

export const initalQuizzesState: QuizzesState = {
  isLoaded: false,
  isLoading: false,
  ids: [],
  entities: {},
  selectedQuizId: undefined,
  selectedQuestionIndex: undefined,
};


export interface QuizzesAppState {
  seed: string;
  quizzes: QuizzesState;
}

export const initialQuizzesAppState: QuizzesAppState = {
  seed: UUID.UUID().slice(0, 8),
  quizzes: initalQuizzesState,
};


export const quizzesFeatureName = 'quizzes';


export const selectSeed = (state: QuizzesAppState) => state.seed;


export const selectQuizzesState = (state: QuizzesAppState) => state.quizzes;

const selectQuizzesIsLoadedFromQuizzesState = (state: QuizzesState) => state.isLoaded;
export const selectQuizzesIsLoaded = createSelector(selectQuizzesState, selectQuizzesIsLoadedFromQuizzesState);

const selectQuizzesIsLoadingFromQuizzesState = (state: QuizzesState) => state.isLoading;
export const selectQuizzesIsLoading = createSelector(selectQuizzesState, selectQuizzesIsLoadingFromQuizzesState);

const selectQuizzesLoadingErrorFromQuizzesState = (state: QuizzesState) => state.loadingError;
export const selectQuizzesLoadingError = createSelector(selectQuizzesState, selectQuizzesLoadingErrorFromQuizzesState);

const selectSelectedQuizIdFromQuizzesState = (state: QuizzesState) => state.selectedQuizId;
export const selectSelectedQuizId = createSelector(selectQuizzesState, selectSelectedQuizIdFromQuizzesState);

const selectSelectedQuestionIndexFromQuizzesState = (state: QuizzesState) => state.selectedQuestionIndex;
export const selectSelectedQuestionIndex = createSelector(selectQuizzesState, selectSelectedQuestionIndexFromQuizzesState);


export const selectAnswersStateFromQuizState = (state: QuizState) => state ? state.answers : initialAnswersState;

const selectAnswerIsSubmittingFromAnswersState = (state: AnswersState) => state.isSubmitting;
export const selectAnswerIsSubmittingFromQuizState = createSelector(
  selectAnswersStateFromQuizState, selectAnswerIsSubmittingFromAnswersState);

const selectSubmittingErrorFromAnswersState = (state: AnswersState) => state.submittingError;
export const selectAnswerSubmittingErrorFromQuizState = createSelector(
  selectAnswersStateFromQuizState, selectSubmittingErrorFromAnswersState);

const selectAnswersFromAnswersState = (state: AnswersState) => state.answers;
export const selectAnswersFromQuizState = createSelector(
  selectAnswersStateFromQuizState, selectAnswersFromAnswersState);
