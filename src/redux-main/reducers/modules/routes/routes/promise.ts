import {
  routesLoadRoutes,
  routesLoadRouteById,
  routesCreateRoute,
  routesUpdateRoutes,
  routesDeleteRoutes,
  routesValidateRoute,
} from 'redux-main/reducers/modules/routes/promises';
import { keyBy } from 'lodash';

export const getRoutes = routesLoadRoutes;
export const getRouteById = routesLoadRouteById;
export const createRoute = routesCreateRoute;
export const updateRoute = routesUpdateRoutes;
export const removeRoutes = routesDeleteRoutes;
export const validateRoute = routesValidateRoute;

export const getSetRoutes = async (...payload) => {
  const { data } = await getRoutes(...payload);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};
export const getSetRouteById = async (id) => {
  const { route_data } = await getRouteById(id);

  return {
    route_data,
  };
};
export const createSetRoute = (rawRoute, isTemplate) => {
  const payload = {
    ...rawRoute,
  };

  return createRoute(
    payload,
    isTemplate,
  );
};
export const updateSetRoute = (oldRoute) => {
  const payload = {
    ...oldRoute,
  };

  return updateRoute(
    payload,
  );
};
export const deleteSetRoute = (id) => {
  return removeRoutes(
    id,
  );
};
export const validateSetRoute = (route) => {
  return validateRoute(
    route,
  );
};
