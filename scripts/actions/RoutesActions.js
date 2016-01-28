import { Actions } from 'flummox';
import { getRoutes, getRouteById, createRoute, removeRoute, updateRoute } from '../adapter.js';
import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';

export default class RoutesActions extends Actions {

  getRoutes() {
    return getRoutes();
  }

  getRouteById(id) {
    const payload = { id };
    return getRouteById(payload);
  }

  createRoute(route) {
    const payload = _.cloneDeep(route);
    delete payload.polys;
    _.each(payload.object_list, o => delete o.name);
    console.log(payload.object_list);
    payload.object_list = JSON.stringify(payload.object_list);
    return createRoute(payload);
  }

  removeRoute(route) {
    const payload = { id: route.id };
    return removeRoute(payload);
  }

  updateRoute(route) {
    const payload = _.cloneDeep(route);
    return updateRoute(payload);
  }

}
