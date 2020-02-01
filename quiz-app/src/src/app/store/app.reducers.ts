import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';


export interface AppState {
  router: RouterReducerState;
}


export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
};
