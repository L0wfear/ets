import { actionSetNewData } from 'redux-main/reducers/modules/routes/common';
import {
  promiseLoadRoutes,
  promiseLoadRouteById,
  promiseCreateRoute,
  promiseUpdateRoute,
  promiseDeleteRoute,
  promiseValidateRoute,
} from 'redux-main/reducers/modules/routes/promise';
import {
  IStateRoutes,
  Route,
} from 'redux-main/reducers/modules/routes/@types';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { HandleThunkActionCreator } from 'react-redux';

const actionSetRoutes = (routesList: IStateRoutes['routesList'], routesIndex: IStateRoutes['routesIndex']): ThunkAction<Pick<IStateRoutes, 'routesList' | 'routesIndex'>, ReduxState, {}, AnyAction> => (dispatch) => {
  dispatch(
    actionSetNewData({
      routesList,
      routesIndex,
    }),
  );

  return {
    routesList,
    routesIndex,
  };
};
const actionResetSet = (): ThunkAction<Pick<IStateRoutes, 'routesList' | 'routesIndex'>, ReduxState, {}, AnyAction> => (dispatch) => {
  const routesList = [];
  const routesIndex = {};

  dispatch(
    actionSetRoutes(
      routesList,
      routesIndex,
    ),
  );

  return {
    routesList,
    routesIndex,
  };
};
const actionLoadRoutes = (ownPayload: object, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseLoadRoutes>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadRoutes(ownPayload),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionLoadAndSetInStoreRoutes = (payload: object, meta: LoadingMeta): ThunkAction<ReturnType<HandleThunkActionCreator<typeof actionLoadRoutes>>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const response = await dispatch(
    actionLoadRoutes(payload, meta),
  );

  dispatch(
    actionSetRoutes(
      response.data,
      response.dataIndex,
    ),
  );

  return response;
};
const actionLoadRouteById = (id: number, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseLoadRouteById>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseLoadRouteById(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const actionCreateRoute = (routeRaw: Partial<Route>, isTemplate: boolean, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseCreateRoute>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseCreateRoute(routeRaw, isTemplate),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionUpdateRoute = (routeOld: Partial<Route>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseUpdateRoute>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseUpdateRoute(routeOld),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionRemoveRoute = (id: Route['id'], meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseDeleteRoute>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = dispatch({
    type: 'none',
    payload: promiseDeleteRoute(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionValidateRoute = (route: Partial<Route> & Pick<Route, 'technical_operation_id' | 'input_lines' | 'municipal_facility_id'>, meta: LoadingMeta): ThunkAction<ReturnType<typeof promiseValidateRoute>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseValidateRoute(route),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};

const routesActions = {
  actionSetNewData,
  actionSetRoutes,
  actionResetSet,
  actionLoadRoutes,
  actionLoadAndSetInStoreRoutes,
  actionLoadRouteById,
  actionCreateRoute,
  actionUpdateRoute,
  actionRemoveRoute,
  actionValidateRoute,
};

export default routesActions;
