import { Actions } from 'flummox';
import {
  get,
} from 'lodash';
import {
  RouteService,
} from 'api/Services';

export default class RoutesActions extends Actions {
  getRoutesBySomeData(data) {
    const payload = {
      ...data,
    };

    return RouteService.get(payload).then(({ result = [] }) => result);
  }

  async getRoutesByDutyMissionId(id, isTemplate) {
    const payload = isTemplate ? { duty_mission_template_id: id } : { duty_mission_id: id };

    if (!id) {
      delete payload.duty_mission_id;
      delete payload.duty_mission_template_id;
    }

    const response = await RouteService.get(payload);
    return response.result || [];
  }

  async getRoutesByMissionId(id, isTemplate) {
    const payload = isTemplate ? { mission_template_id: id } : { mission_id: id };

    const response = await RouteService.get(payload);
    return response.result || [];
  }

  /**
    * Получение маршрута по id
    * @param {number} id - идентификатор маршрута
    * @param {boolean} simple - возвращать ли облегченную версию данных
    * @return {object|null} route - маршрут
    */
  async getRouteById(id, simple) {
    const payload = { id };
    if (simple) {
      payload.simple = 1;
    }
    const response = await RouteService.get(payload);

    const route = response && response.result && response.result[0]
      ? response.result[0]
      : null;

    if (route) {
      if (route.type === 'points') {
        route.object_list.forEach((el, i) => {
          // todo
          // заставить бэк выдавать id
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
          route.draw_odh_list = [];

          if (route.input_lines && route.input_lines.length) {
            route.input_lines.forEach((object) => {
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
            route.input_lines = [];
          }
          route.draw_object_list.forEach((object) => {
            const start = [object.begin.x_msk, object.begin.y_msk];
            const end = [object.end.x_msk, object.end.y_msk];
            object.shape = {
              type: 'LineString',
              coordinates: [start, end],
            };

            object.type = 'odh';
            return object;
          });

          route.object_list.forEach((object, i) => {
            if (object.from_vectors) {
              route.draw_odh_list.push(object);
              route.input_lines.push(object);
              route.object_list.splice(i, 1);
            }
          });
        }
        const shapes = get(route, 'shapes', {});

        route.object_list.map((objData) => {
          const myShape = get(shapes, objData.object_id, null);

          try {
            objData.shape = JSON.parse(myShape);
          } catch (e) {
            objData.shape = myShape;
          }

          return objData;
        });
      }
    }

    return route;
  }
}
