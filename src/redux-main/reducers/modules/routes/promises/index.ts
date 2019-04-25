import {
  RouteService,
  RouteValidateService,
} from 'api/Services';
import { get, cloneDeep } from 'lodash';
import { Route } from '../@types/routes.h';
import { getErrorNotificationFromBack } from 'utils/notifications';

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

const makeRoute = (route_data) => {
  const route: Route = cloneDeep(route_data);
  if (route.type === 'points') {
    route.object_list.forEach((el, i) => {
      el.customId = i + 1;

      if (!el.shape && el.coordinates) {
        el.shape = {
          type: 'Point',
          coordinates: el.coordinates,
        };
      }
      el.type = 'points';
      return el;
    });
  } else {
    if (route.type === 'mixed') {
      if (route.input_lines && route.input_lines.length) {
        route.input_lines.forEach((object) => {
          const start = [object.begin.x_msk, object.begin.y_msk];
          const end = [object.end.x_msk, object.end.y_msk];
          object.shape = {
            type: 'LineString',
            coordinates: [start, end],
          };
          (object as any).type = 'odh';
          return object;
        });
      } else {
        route.input_lines = [];
      }
      route.draw_object_list.forEach((object) => {
        const start = [object.begin.x_msk, object.begin.y_msk];
        const end = [object.end.x_msk, object.end.y_msk];
        object.shape = {
          type: 'LineString',
          coordinates: [start, end],
        };
        (object as any).type = 'odh';
        return object;
      });

      route.object_list.forEach((object, i) => {
        if (object.from_vectors) {
          route.input_lines.push(object);
          route.object_list.splice(i, 1);
        }
      });
    }

    const shapes = get(route, 'shapes', {});

    route.object_list.forEach((objData) => {
      const myShape = get(shapes, objData.object_id, null);

      try {
        objData.shape = JSON.parse(myShape);
      } catch (e) {
        objData.shape = myShape;
      }
    });
  }

  return route;
};

export const routesLoadRouteById = (id) => (
  RouteService.get({ id })
    .then(({ result: [route_data = null] }) => {
      let route = route_data;
      if (route_data) {
        route = makeRoute(route_data);
      }

      return {
        route_data: route,
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
    .then((response) => ({
      route: makeRoute({
        ...formState,
        ...get(
          response,
          'result.rows.0.0',
          get(
            response,
            'result.rows.0',
            {},
          ),
        ),
      }),
    }));
};
export const routesUpdateRoutes = (formState: Route) => {
  const payload = {
    ...formState,
  };

  return RouteService.put(payload, false, 'json')
    .then((response) => ({
      route: makeRoute({
        ...formState,
        ...get(
          response,
          'result.rows.0.0',
          get(
            response,
            'result.rows.0',
            {},
          ),
        ),
      }),
    }));
};
export const routesDeleteRoutes = async (id) => {
  const payload = { id: Number(id) };
  try {
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
      global.NOTIFICATION_SYSTEM.notify(getErrorNotificationFromBack('Произошла ошибка проверки маршрута'));

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
