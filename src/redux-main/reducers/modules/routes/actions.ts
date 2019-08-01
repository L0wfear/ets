import { actionSetNewData } from 'redux-main/reducers/modules/routes/common';
import {
  promiseLoadRoutes,
  promiseLoadRouteById,
  promiseCreateRoute,
  promiseUpdateRoute,
  promiseDeleteRoute,
  promiseValidateRoute,
} from 'redux-main/reducers/modules/routes/promise';
import { IStateRoutes, Route } from 'redux-main/reducers/modules/routes/@types';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { HandleThunkActionCreator } from 'react-redux';
import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';

const actionSetRoutes = (
  routesList: IStateRoutes['routesList'],
  routesIndex: IStateRoutes['routesIndex'],
): EtsAction<Pick<IStateRoutes, 'routesList' | 'routesIndex'>> => (dispatch) => {
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
const actionResetSetRoutes = (): EtsAction<Pick<IStateRoutes, 'routesList' | 'routesIndex'>> => (dispatch) => {
  const routesList = [];
  const routesIndex = {};

  dispatch(actionSetRoutes(routesList, routesIndex));

  return {
    routesList,
    routesIndex,
  };
};
const actionLoadRoutes = (
  ownPayload: object,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseLoadRoutes>> => async (dispatch) => {
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
const actionLoadAndSetInStoreRoutes = (
  payload: object,
  meta: LoadingMeta,
): EtsAction<ReturnType<HandleThunkActionCreator<typeof actionLoadRoutes>>, > => async (dispatch) => {
  const response = await dispatch(actionLoadRoutes(payload, meta));

  dispatch(actionSetRoutes(response.data, response.dataIndex));

  return response;
};
const actionLoadRouteById = (
  id: number,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseLoadRouteById>, > => async (dispatch) => {
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

const actionCreateRoute = (
  routeRaw: Partial<Route>,
  isTemplate: boolean,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseCreateRoute>> => async (dispatch) => {
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
const actionUpdateRoute = (
  routeOld: Partial<Route>,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseUpdateRoute>> => async (dispatch) => {
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
const actionRemoveRoute = (
  id: Route['id'],
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseDeleteRoute>> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: promiseDeleteRoute(id),
    meta: {
      promise: true,
      ...meta,
    },
  });

  return payload;
};
const actionValidateRoute = (
  route: Partial<Route> &
    Pick<
      Route,
      'technical_operation_id' | 'input_lines' | 'municipal_facility_id'
    >,
  meta: LoadingMeta,
): EtsAction<ReturnType<typeof promiseValidateRoute>> => async (dispatch) => {
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
  actionResetSetRoutes,
  actionLoadRoutes,
  actionLoadAndSetInStoreRoutes,
  actionLoadRouteById,
  actionCreateRoute,
  actionUpdateRoute,
  actionRemoveRoute,
  actionValidateRoute,
};

export default routesActions;
