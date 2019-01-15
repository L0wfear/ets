import { Actions } from 'flummox';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import * as services from 'api/Services';

export default class GeoObjectsActions extends Actions {
  async getGeozoneByTypeWithGeometry(
    type,
    serviceName = 'GeozonesService',
    payload = { shape: 1 },
  ) {
    const response = await services[serviceName].path(type).get(payload);
    return {
      type: GEOOBJECTS_TYPES[type],
      data: response,
    };
  }

  async getGeozoneByType(type, serviceName = 'GeozonesService') {
    const payload = {};
    const response = await services[serviceName].path(type).get(payload);
    return {
      type: GEOOBJECTS_TYPES[type],
      data: response,
    };
  }

  setInitialState() {
    return true;
  }
}
