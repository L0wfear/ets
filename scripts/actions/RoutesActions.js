import { Actions } from 'flummox';
import { getRoutes, getRouteById, createRoute, removeRoute, updateRoute, getRoutesVector, getRouteVectorById, createVectorRoute, removeRouteVector, getRouteReports, getRouteReportById, createRouteReport, validateRoute, updateRouteVector, getGeozones } from '../adapter.js';
import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';

export default class RoutesActions extends Actions {

  getRoutes() {
    return getRoutes();
  }

  getRoutesVector() {
    return getRoutesVector();
  }

  getRouteById(id) {
    const payload = { id };
    return getRouteById(payload);
  }

  getRouteVectorById(id) {
    const payload = { id };
    return getRouteVectorById(payload);
  }

  createRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    delete payload.technical_operation_id;
    _.each(payload.object_list, o => delete o.name);
    console.log(payload);
    payload.object_list = JSON.stringify(payload.object_list);
    return createRoute(payload);
  }

  createVectorRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    _.each(payload.object_list, o => {
      delete o.name;
      o.technical_operation_id = payload.technical_operation_id;
    });
    console.log(payload);
    payload.object_list = JSON.stringify(payload.object_list);
    return createVectorRoute(payload);
  }

  removeRoute(route) {
    const payload = { id: route.id };
    return removeRoute(payload);
  }

  removeRouteVector(route) {
    const payload = { id: route.id };
    return removeRouteVector(payload);
  }

  updateRoute(route) {
    const payload = _.cloneDeep(route);
    return updateRoute(payload);
  }

  updateRouteVector(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    delete payload.odh_list;
    delete payload.odh_fail_list;
    payload.object_list = JSON.stringify(payload.object_list);
    return updateRouteVector(payload);
  }

  getRouteReports() {
    return getRouteReports();
  }

  getRouteReportById(id) {
    const payload = { id };
    return getRouteReportById(payload);
  }

  createRouteReport(operation_id) {
    const payload = { operation_id };
    return createRouteReport(payload);
  }

  validateRoute(route) {
    const route_vector = {
      technical_operation_id: 55,//route.technical_operation_id,
      object_list: route.object_list,
    };
    const payload = {
      route_vector: JSON.stringify(route_vector),
    };
    return validateRoute(payload);
  }

  getGeozones() {
    return getGeozones();
  }

}
