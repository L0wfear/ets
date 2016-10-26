import { Actions } from 'flummox';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import {
  ODHService,
  DTService,
  GeozoneService,
  GeozonesService,
} from 'api/Services';
import { getValueFromCache, put } from 'utils/cache';

export default class GeoObjectsActions extends Actions {

  getODHs() {
    return ODHService.get();
  }

  getDTs() {
    return DTService.get();
  }

  updateODH(formState) {
    const payload = {
      id: formState.id,
      company_structure_id: formState.company_structure_id || null,
    };

    return ODHService.put(payload, null, 'json');
  }

  updateDT(formState) {
    const payload = {
      id: formState.id,
      dt_id: formState.dt_id,
      company_structure_id: formState.company_structure_id || null,
    };

    return DTService.put(payload, null, 'json');
  }

  async getGeozones() {
    const cachedValue = getValueFromCache('GeozoneService.get()');
    if (cachedValue) {
      return cachedValue;
    }
    const geozones = await GeozoneService.get();
    put('GeozoneService.get()', geozones);
    return geozones;
  }

  async getGeozoneByTypeWithGeometry(type) {
    const payload = {
      shape: 1,
    };
    const response = await GeozonesService.path(type).get(payload);
    return {
      type: GEOOBJECTS_TYPES[type],
      data: response,
    };
  }

  async getGeozoneByType(type) {
    const payload = {};
    const response = await GeozonesService.path(type).get(payload);
    return {
      type: GEOOBJECTS_TYPES[type],
      data: response,
    };
  }

  setSelectedPolysType(type) {
    return type;
  }

}
