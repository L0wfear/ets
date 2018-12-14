import {
  ROUTES_SET_DATA,
} from 'redux-main/reducers/modules/routes/routes';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/routes.h';

export const routesSetNewData = (newStateData: { [K in keyof IStateRoutes]?: IStateRoutes[K] }) => ({
  type: ROUTES_SET_DATA,
  payload: newStateData,
});
