import { Actions } from 'flummox';
import _ from 'lodash';
import { createRoute } from '../adapter.js';
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

  getRouteById(id, simple) {
    const payload = { id };
    if (simple) {
      payload.simple = 1;
    }
    return RouteService.get(payload);
  }

  createRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    // _.each(payload.object_list, o => {
    //   delete o.name;
    // });
    console.log(payload);
    payload.object_list = JSON.stringify(payload.object_list);
    return createRoute(payload);
  }

  removeRoute(route) {
    const payload = { id: route.id };
    return RouteService.delete(payload);
  }

  updateRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    _.each(payload.object_list, o => delete o.shape);
    payload.object_list = JSON.stringify(payload.object_list);
    return RouteService.update(payload);
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
    return RouteReportsService.create(payload);
  }

  validateRoute(route) {
    const route_vector = {
      technical_operation_id: 55,//route.technical_operation_id,
      object_list: route.object_list,
    };
    const payload = {
      route_vector: JSON.stringify(route_vector),
    };
    return RouteValidateService.get(payload);
  }

  getGeozones() {
    return GeozoneService.get();
  }

}
