import { createPath } from 'redux-main/redux-utils';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/routes.h';

const ROUTES = createPath('ROUTES');

export const ROUTES_SET_DATA = ROUTES`SET_DATA`;

const initialState: IStateRoutes = {
  routesList: [],
  routesIndex: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ROUTES_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
