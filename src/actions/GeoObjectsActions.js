import { Actions } from 'flummox';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import * as services from 'api/Services';
import { getValueFromCache, put } from 'utils/cache';

export default class GeoObjectsActions extends Actions {
  getODHs() {
    return services.ODHService.get();
  }

  updateODH(formState) {
    const payload = {
      id: formState.id,
      company_structure_id: formState.company_structure_id || null,
    };
    return services.ODHService.put(payload, null, 'json');
  }

  updateDT(formState) {
    const payload = {
      id: formState.id,
      dt_id: formState.dt_id,
      company_structure_id: formState.company_structure_id || null,
    };
    return services.DTService.put(payload, false, 'json');
  }

  async getGeozones() {
    const cachedValue = getValueFromCache('GeozoneService.get()');
    if (cachedValue) {
      return cachedValue;
    }
    const geozones = await services.GeozoneService.get();
    put('GeozoneService.get()', geozones);
    return geozones;
  }

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

  setSelectedPolysType(type) {
    return type;
  }

  async getGeozoneByTypeWithGeometryLeak(type, formState, serviceName = 'FuelEvent') {
    const payload = {
      ...formState,
    };
    const response = await services[serviceName].path(`${type}/leak`).get(payload);
    return {
      type: 'leak',
      data: response,
    };
  }
}
