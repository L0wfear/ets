import { routesSetNewData } from 'redux-main/reducers/modules/routes/common';
import {
  getSetRoutes,
  getSetRouteById,
  createSetRoute,
  updateSetRoute,
  validateSetRoute,
} from 'redux-main/reducers/modules/routes/routes/promise';
import { IStateRoutes } from 'redux-main/reducers/modules/routes/@types/routes.h';
import { Route } from '../@types/routes.h';
import { deleteSetRoute } from './promise';
import { LoadingMeta } from '../../../../_middleware/@types/ets_loading.h';
import { ReduxState } from 'redux-main/@types/state';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const routesSetRoutes = (routesList: IStateRoutes['routesList'], routesIndex: IStateRoutes['routesIndex']) => (dispatch) => (
  dispatch(
    routesSetNewData({
      routesList,
      routesIndex,
    }),
  )
);
export const routesResetSet = () => (dispatch) => (
  dispatch(
    routesSetRoutes([], {}),
  )
);
export const routesGetSetRoutes = (ownPayload: any, { page, path }: LoadingMeta): ThunkAction<Promise<{ data: Route[], dataIndex: { [K: string]: Route } }>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: getSetRoutes(ownPayload),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};

export const getAndSetInStore = (payload = {}, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { data, dataIndex } = await dispatch(
    routesGetSetRoutes(payload, { page, path }),
  );

  dispatch(
    routesSetRoutes(data, dataIndex),
  );

  return {
    List: data,
    Index: dataIndex,
  };
};
export const routesResetSetRoutesLinear = () => (dispatch) => (
  dispatch(
    routesSetRoutes([], {}),
  )
);
export const routesLoadRouteById = (id: number, { page, path }: LoadingMeta): ThunkAction<Promise<{ route_data: Route }>, ReduxState, {}, AnyAction> => async (dispatch) => {
  const { payload } = await dispatch({
    type: 'none',
    payload: getSetRouteById(id),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return payload;
};

export const routesCreateRoute: any = (routeRaw: Route, isTemplate: boolean, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { route } } = await dispatch({
    type: 'none',
    payload: createSetRoute(routeRaw, isTemplate),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return route;
};
export const routesUpdateRoute: any = (routeOld: Route, { page, path }: { page: string; path?: string }) => async (dispatch) => {
  const { payload: { route } } = await dispatch({
    type: 'none',
    payload: updateSetRoute(routeOld),
    meta: {
      promise: true,
      page,
      path,
    },
  });

  return route;
};
export const routesRemoveRoute: any = (id, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: deleteSetRoute(id),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
export const routesValidateRoute: any = (routes, { page, path }: { page: string; path?: string }) => async (dispatch) => (
  dispatch({
    type: 'none',
    payload: validateSetRoute(routes),
    meta: {
      promise: true,
      page,
      path,
    },
  })
);
