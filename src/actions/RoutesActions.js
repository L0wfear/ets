import { Actions } from 'flummox';
import _ from 'lodash';
import {
  RouteService,
  RouteReportsService,
  RouteValidateService,
} from 'api/Services';

export default class RoutesActions extends Actions {

  getRoutes(technical_operation_id) {
    const payload = {};
    if (technical_operation_id) {
      payload.technical_operation_id = technical_operation_id;
    }
    return RouteService.get(payload);
  }

  async getRoutesByTechnicalOperation(technical_operation_id) {
    const payload = { technical_operation_id };

    if (!technical_operation_id) {
      delete payload.technical_operation_id;
    }

    const response = await RouteService.get(payload);
    return response.result || [];
  }

  async getRoutesByDutyMissionId(duty_mission_id) {
    const payload = { duty_mission_id };

    if (!duty_mission_id) {
      delete payload.duty_mission_id;
    }

    const response = await RouteService.get(payload);
    return response.result || [];
  }

  async getRoutesByMissionId(mission_id) {
    const payload = { mission_id };

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
      /* TODO нужно чтобы с бека присылались типы объектов
       * чтобы избавиться от этого map */
      if (route.type === 'points') {
        route.object_list.map((el) => {
          if (!el.shape && el.coordinates) {
            el.shape = {
              type: 'Point',
              coordinates: el.coordinates,
            };
          }
          return el;
        });
      } else if (route.type === 'vector') {
        route.object_list.map((object) => {
          const start = [object.begin.x_msk, object.begin.y_msk];
          const end = [object.end.x_msk, object.end.y_msk];
          object.shape = {
            type: 'LineString',
            coordinates: [start, end],
          };
          return object;
        });
      }
    }

    return route;
  }

  async createRoute(route, isTemplate = 0) {
    const payload = _.cloneDeep(route);
    const params = {
      is_template: +isTemplate
    };
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    delete payload.copy;
    const createdRoute = await RouteService.post(payload, false, 'json', params);
    const routes = await RouteService.get();
    return { createdRoute, routes };
  }

  removeRoute(route) {
    const payload = { id: route.id };
    return RouteService.delete(payload, null, 'json');
  }

  updateRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    _.each(payload.object_list, o => delete o.shape);
    return RouteService.put(payload, null, 'json');
  }

  getRouteReports() {
    return RouteReportsService.get();
  }

  getRouteReportById(id) {
    return RouteReportsService.path(id).get();
  }

  createRouteReport(operation_id) {
    const payload = { operation_id };
    return RouteReportsService.post(payload);
  }

  validateRoute(route) {
    const payload = {
      technical_operation_id: route.technical_operation_id,
      object_list: route.object_list,
    };
    return RouteValidateService.post(payload, false, 'json');
  }

}
