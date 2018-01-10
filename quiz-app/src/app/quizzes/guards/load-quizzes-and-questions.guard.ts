import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { QuizzesStoreService } from '../store/quizzes-store.service';


@Injectable()
export class LoadQuizzesAndQuestionsGuard implements CanActivate {
  constructor(private quizzesStoreService: QuizzesStoreService) {}

  canActivate(): boolean {
    this.quizzesStoreService.dispatchLoadQuizzesListActionIfNotLoadedYet();
    return true;
  }
}
