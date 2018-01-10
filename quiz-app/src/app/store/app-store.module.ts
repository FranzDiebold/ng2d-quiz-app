import { NgModule } from '@angular/core';

import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '../../environments/environment';
import { reducers } from './app.reducers';
import { quizzesFeatureName } from '../quizzes/store/quizzes.state';


export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: [quizzesFeatureName],
    rehydrate: true,
  })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  imports: [
    StoreModule.forRoot(
      reducers,
      {metaReducers}
    ),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 10 }) : []
  ],
})
export class AppStoreModule {}
