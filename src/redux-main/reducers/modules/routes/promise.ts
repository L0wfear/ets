import {
  RouteService,
  RouteValidateService,
} from 'api/Services';
import { get, keyBy, cloneDeep } from 'lodash';
import { Route, OdhValidate, DrawData } from './@types';
import { getErrorNotificationFromBack } from 'utils/notifications';

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

          return object;
        });
      } else {
        route.input_lines = [];
      }
      route.draw_object_list = route.draw_object_list || [];

      route.draw_object_list.forEach((object: DrawData) => {
        const begin = get(object, 'begin') || { x_msk: 0, y_msk: 0 };
        const end = get(object, 'end') || { x_msk: 0, y_msk: 0 };
        const start = [begin.x_msk, begin.y_msk];
        const finish = [end.x_msk, end.y_msk];

        object.shape = {
          type: 'LineString',
          coordinates: [start, finish],
        };

        return object;
      });

      route.object_list.forEach((objData, i) => {
        if (objData.from_vectors) {
          route.input_lines.push(objData);
          route.object_list.splice(i, 1);
        }
      });
    }
    const shapes = get(route, 'shapes', {});

    route.object_list.forEach((objData, i) => {
      if (objData.type === 'odh' || objData.type === 'dt') {
        const myShape = get(shapes, objData.object_id, null);

        try {
          objData.shape = JSON.parse(myShape);
        } catch (e) {
          objData.shape = myShape;
        }
      }
    });
  }

  return route;
};

export const promiseLoadRoutes = async (payload: object) => {
  let response = null;

  try {
    response = await RouteService.get({ ...payload });
  } catch (error) {
      console.log(error); // tslint:disable-line:no-console
  }
  const data: Route[] = get(response, ['result'], []);
  const dataIndex = keyBy(data, 'id');

  return {
    data,
    dataIndex,
  };
};

export const promiseLoadRouteById = async (id: Route['id']) => {
  let response = null;

  try {
    response = await RouteService.get({ id });
  } catch (error) {
    console.warn(error); // tslint:disable-line

    return null;
  }

  let route: Route | null = get(response, ['result', 0], null);

  if (route) {
    route = makeRoute(route);
  }

  return route;
};
export const promiseCreateRoute = async (formState: Partial<Route>, isTemplate?: boolean) => {
  const payload = {
    ...formState,
  };
  const params = {
    is_template: Number(isTemplate),
  };

  if (isTemplate) {
    payload.is_template = true;
  }

  const response = await RouteService.post(payload, false, 'json', params);

  const route_data: Partial<Route> = makeRoute({
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
  });

  return route_data;
};
export const promiseUpdateRoute = async (formState: Partial<Route>) => {
  const payload = {
    ...formState,
  };

  const response = await RouteService.put(payload, false, 'json');

  const route_data: Partial<Route> = makeRoute({
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
  });

  return route_data;
};
export const promiseDeleteRoute = async (id: Route['id']) => {
  const payload = { id };

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

  return id;
};
export const promiseValidateRoute = async (route: Partial<Route> & Pick<Route, 'technical_operation_id' | 'input_lines' | 'municipal_facility_id'>) => {
  const payload = {
    technical_operation_id: route.technical_operation_id,
    object_list: route.input_lines,
    municipal_facility_id: route.municipal_facility_id,
  };

  let response = null;

  try {
    response = await RouteValidateService.post(payload, false, 'json');
  } catch (error) {
    global.NOTIFICATION_SYSTEM.notify(getErrorNotificationFromBack('Произошла ошибка проверки маршрута'));
    console.warn(error); // tslint:disable-line:no-console
  }

  const odh_fail_count: number = get(response, ['result', 'odh_fail_count'], 0);
  const odh_success_count: number = get(response, ['result', 'odh_success_count'], 0);
  const odh_total_count: number = get(response, ['result', 'odh_total_count'], 0);
  const odh_validate_result: OdhValidate[] = get(response, ['result', 'odh_validate_result'], []);
  const odh_visited_count: number = get(response, ['result', 'odh_visited_count'], 0);

  const route_validate = {
    odh_fail_count,
    odh_success_count,
    odh_total_count,
    odh_validate_result,
    odh_visited_count,
  };

  return route_validate;
};
