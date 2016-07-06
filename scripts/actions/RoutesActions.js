import { Actions } from 'flummox';
import _ from 'lodash';
import { createValidDateTime } from 'utils/dates';
import { RouteService, RouteReportsService, RouteValidateService, GeozoneService } from 'api/Services';

export default class RoutesActions extends Actions {

  constructor(props) {
    super();
  }

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

    let response = await RouteService.get(payload);
    return response.result || [];
  }

  async getRoutesByDutyMissionId(duty_mission_id) {
    const payload = { duty_mission_id };

    if (!duty_mission_id) {
      delete payload.duty_mission_id;
    }

    let response = await RouteService.get(payload);
    return response.result || [];
  }

  async getRoutesByMissionId(mission_id) {
    const payload = { mission_id };

    let response = await RouteService.get(payload);
    return response.result || [];
  }

  getRouteById(id, simple) {
    const payload = { id };
    if (simple) {
      payload.simple = 1;
    }
    return RouteService.get(payload);
  }

  async createRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    delete payload.copy;
    payload.object_list = JSON.stringify(payload.object_list);
    const createdRoute = await RouteService.post(payload, false, 'json');
    const routes = await RouteService.get();
    return {createdRoute, routes};
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
    payload.object_list = JSON.stringify(payload.object_list);
    return RouteService.put(payload, null, 'json');
  }

  getRouteReports() {
    return RouteReportsService.get();
  }

  getRouteReportById(id) {
    const payload = { id };
    return RouteReportsService.get(payload);
  }

  createRouteReport(operation_id) {
    const payload = { operation_id };
    return RouteReportsService.post(payload);
  }

  // validateRoute(route) {
  //   const route_vector = {
  //     technical_operation_id: 55,//route.technical_operation_id,
  //     object_list: route.object_list,
  //   };
  //   const payload = {
  //     route_vector: JSON.stringify(route_vector),
  //   };
  //   return RouteValidateService.get(payload);
  // }

  validateRoute(route) {
    const route_vector = {
      technical_operation_id: 55,//route.technical_operation_id,
      object_list: route.object_list,
    };
    const payload = {
      technical_operation_id: 55,//route.technical_operation_id,
      object_list: JSON.stringify(route.object_list),
    };
    return RouteValidateService.post(payload, false, 'json');
  }

  getGeozones() {
    return GeozoneService.get();
  }

}
