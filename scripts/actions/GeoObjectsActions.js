import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';
import { isEmpty } from 'utils/functions';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects';
import {
  SSPService,
  FuelingWaterService,
  CarPoolService,
  DangerZoneService,
  ODHService,
  DTService,
  GeozoneService,
  GeozonesService
} from 'api/Services';

export default class GeoObjectsActions extends Actions {

  constructor(props) {
    super();
  }

  getODHs() {
    return ODHService.get();
  }

  getDTs() {
    return DTService.get();
  }

  getSSPs() {
    return SSPService.get();
  }

  getFuelingWaterStations() {
    return FuelingWaterService.get();
  }

  getCarpools() {
    return CarPoolService.get();
  }

  getDangerZones() {
    return DangerZoneService.get();
  }

  updateODH(formState) {
    const payload = {
      id: formState.id,
      company_structure_id: formState.company_structure_id || null,
    };

    return ODHService.put(payload);
  }

  updateDT(formState) {
    const payload = {
      id: formState.id,
      dt_id: formState.dt_id,
      company_structure_id: formState.company_structure_id || null,
    };

    return DTService.put(payload);
  }

  getGeozones() {
    return GeozoneService.get();
  }

  async getGeozoneByTypeWithGeometry(type) {
    const payload = {
      shape: 1
    };
    const response = await GeozonesService.path(type).get(payload);
    return {
      type: GEOOBJECTS_TYPES[type],
      data: response
    };
  }

  setSelectedPolysType(type) {
    return type;
  }

}
