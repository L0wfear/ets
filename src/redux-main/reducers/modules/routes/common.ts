import {
  ROUTES_SET_DATA,
} from 'redux-main/reducers/modules/routes/routes';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types';

export const actionSetNewData = (newStateData: Partial<IStateRoutes>) => ({
  type: ROUTES_SET_DATA,
  payload: newStateData,
});
