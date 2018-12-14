import {
  RouteService,
  RouteValidateService,
} from 'api/Services';
import { get } from 'lodash';
import { Route } from '../@types/routes.h';

/* ------------- ROUTES ------------- */
export const routesLoadRoutes = (payload = {}) => (
  RouteService.get({ ...payload })
    .catch((error) => {
      // tslint:disable-next-line
      console.log(error);

      return {
        result: [],
      };
    })
    .then((ans) => ({
      data: get(ans, ['result'], []),
    }))
);
export const routesLoadRouteById = (id) => (
  RouteService.get({ id })
    .then(({ result: [route_data = null] }) => {
      if (route_data) {
        if (route_data.type === 'points') {
          route_data.object_list.forEach((el) => {
            if (!el.shape && el.coordinates) {
              el.shape = {
                type: 'Point',
                coordinates: el.coordinates,
              };
            }
            el.type = 'points';
            return el;
          });
        } else if (route_data.type === 'mixed') {
          route_data.draw_odh_list = [];

          if (route_data.input_lines && route_data.input_lines.length) {
            route_data.input_lines.forEach((object) => {
              const start = [object.begin.x_msk, object.begin.y_msk];
              const end = [object.end.x_msk, object.end.y_msk];
              object.shape = {
                type: 'LineString',
                coordinates: [start, end],
              };
              object.type = 'odh';
              return object;
            });
          } else {
            route_data.input_lines = [];
          }
          route_data.draw_object_list.forEach((object) => {
            const start = [object.begin.x_msk, object.begin.y_msk];
            const end = [object.end.x_msk, object.end.y_msk];
            object.shape = {
              type: 'LineString',
              coordinates: [start, end],
            };
            object.type = 'odh';
            return object;
          });

          route_data.object_list.forEach((object, i) => {
            if (object.from_vectors) {
              route_data.draw_odh_list.push(object);
              route_data.input_lines.push(object);
              route_data.object_list.splice(i, 1);
            }
          });
        }
      }

      return {
        route_data,
      };
    })
    .catch((error) => {
      console.warn(error); // tslint:disable-line

      return {
        route_data: null,
      };
    })
);
export const routesCreateRoute = (formState: Route, isTemplate?: boolean) => {
  const payload = {
    ...formState,
  };
  const params = {
    is_template: Number(isTemplate),
  };

  return RouteService.post(payload, false, 'json', params)
    .then(({ result: [{ id }]}) => ({
      route: {
        ...formState,
        id,
      },
    }));
};
export const routesUpdateRoutes = (formState: Route) => {
  const payload = {
    ...formState,
  };

  return RouteService.put(payload, false, 'json')
    .then(({ result: [{ id }]}) => ({
      route: {
        ...formState,
        id,
      },
    }));
};
export const routesDeleteRoutes = async (id) => {
  const payload = { id: Number(id) };
  try {
    /*
    return RouteService.path(id).delete(
      {},
      false,
      'json',
    )
    */
    await RouteService.delete(
      payload,
      false,
      'json',
    );
    global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
  } catch (e) {
    console.warn(e); // tslint:disable-line
  }
};
export const routesValidateRoute = (formState: Route) => {
  const payload = {
    technical_operation_id: formState.technical_operation_id,
    object_list: formState.input_lines,
    municipal_facility_id: formState.municipal_facility_id,
  };

  return RouteValidateService.post(payload, false, 'json')
    .catch((e) => {
      console.warn(e); // tslint:disable-line

      return {
        result: {
          odh_fail_count: 0,
          odh_success_count: 0,
          odh_total_count: 0,
          odh_validate_result: [],
          odh_visited_count: 0,
        },
      };
    })
    .then(({ result }) => ({
      route_validate: result,
    }));
};
