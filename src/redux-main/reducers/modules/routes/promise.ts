import {
  RouteService,
  RouteValidateService,
} from 'api/Services';
import { get, keyBy } from 'lodash';
import { Route, OdhValidate, DrawData } from './@types';
import { getErrorNotificationFromBack } from 'utils/notifications';

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

  const route_data: Route | null = get(response, ['result', 0], null);

  if (route_data) {
    if (route_data.type === 'points') {
      route_data.object_list.forEach((el, i) => {
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
      if (route_data.type === 'mixed') {
        if (route_data.input_lines && route_data.input_lines.length) {
          route_data.input_lines.forEach((object) => {
            const start = [object.begin.x_msk, object.begin.y_msk];
            const end = [object.end.x_msk, object.end.y_msk];

            object.shape = {
              type: 'LineString',
              coordinates: [start, end],
            };

            return object;
          });
        } else {
          route_data.input_lines = [];
        }
        route_data.draw_object_list.forEach((object: DrawData) => {
          const start = [object.begin.x_msk, object.begin.y_msk];
          const end = [object.end.x_msk, object.end.y_msk];

          object.shape = {
            type: 'LineString',
            coordinates: [start, end],
          };

          return object;
        });

        route_data.object_list.forEach((objData, i) => {
          if (objData.from_vectors) {
            route_data.input_lines.push(objData);
            route_data.object_list.splice(i, 1);
          }
        });
      }
      const shapes = get(route_data, 'shapes', {});

      route_data.object_list.forEach((objData, i) => {
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
  }

  return route_data;
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

  const route_data: Partial<Route> = {
    ...formState,
    id: get(response, ['result', 0, 'id'], null),
  };

  return route_data;
};
export const promiseUpdateRoute = async (formState: Partial<Route>) => {
  const payload = {
    ...formState,
  };

  const response = await RouteService.put(payload, false, 'json');

  const route_data: Partial<Route> = {
    ...formState,
    id: get(response, ['result', 0, 'id'], null),
  };

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
