import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Quiz } from '../models/quiz.model';
import { Answer } from '../models/answer.type';
import { AnswerResponse } from './answer-response.model';


@Injectable()
export class QuizzesService {
  ERROR_MESSAGE = 'Oops, an error occurred 😞';
  private API_PATH = environment.apiEndpoint;

  constructor(private httpClient: HttpClient) {}

  getQuizzesAndQuestions(seed: string): Observable<Quiz[]> {
    return this.httpClient
      .get<Quiz[]>(`${this.API_PATH}?seed=${seed}`);
  }

  submitAnswer(quizId: string, seed: string, questionId: string, answer: Answer): Observable<AnswerResponse> {
    let answerToSubmit: string = String(answer);
    if (Array.isArray(answer)) {
      answerToSubmit = `[${answerToSubmit}]`;
    }
    return this.httpClient
      .get<AnswerResponse>(`${this.API_PATH}?quiz_id=${quizId}&seed=${seed}&question_id=${questionId}&answer=${answerToSubmit}`);
  }
}
