import { Actions } from 'flummox';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import * as services from 'api/Services';
import { getValueFromCache, put } from 'utils/cache';

export default class GeoObjectsActions extends Actions {
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

  async getGeozones(company_id) {
    let cacheName = 'GeozoneService.get()';
    const payload = {};

    if (company_id) {
      cacheName = `GeozoneService.get(${company_id})`;
      payload.company_id = company_id;
    }

    const cachedValue = getValueFromCache(cacheName);
    if (cachedValue) {
      return cachedValue;
    }
    const geozones = await services.GeozoneService.get(payload);
    put(cacheName, geozones);
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

  getGeozoneMunicipalFacility(municipal_facility_id, object_type_id) {
    const payload = {
      municipal_facility_id,
      object_type_id,
    };

    return services.GeozoneMunicipalFacilityService.get(payload).then(({ result }) => result);
  }

  setInitialState() {
    return true;
  }
}
