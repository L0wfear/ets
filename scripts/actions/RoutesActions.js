import { Actions } from 'flummox';
import { getRoutes, getRouteById, createRoute, removeRoute, updateRoute, getRoutesVector, getRouteVectorById, createVectorRoute, removeRouteVector, getRouteReports } from '../adapter.js';
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
    _.each(payload.object_list, o => delete o.name);
    console.log(payload.object_list);
    payload.object_list = JSON.stringify(payload.object_list);
    return createRoute(payload);
  }

  createVectorRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
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

  getRouteReports() {
    return getRouteReports();
  }

}
