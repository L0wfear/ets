import { Actions } from 'flummox';
import _ from 'lodash';
import { TechnicalOperationService, TechnicalOperationObjectsService, TechnicalOperationTypesService } from 'api/Services';
import { isEmpty } from 'utils/functions';

function getTechnicalOperations(payload = {}) {
  return TechnicalOperationService.get(payload).then(r => ({ result: r.result.rows }));
}

export default class TechnicalOperationsActions extends Actions {

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperationsTypes() {
    return TechnicalOperationTypesService.get();
  }

  getTechnicalOperations(all) {
    const payload = {
      actual_seasons: all ? 0 : 1,
    };
    return getTechnicalOperations(payload);
  }

  async getTechnicalOperationsByCarId(car_id) {
    const payload = { car_id };
    if (isEmpty(car_id)) {
      delete payload.car_id;
    }
    payload.actual_seasons = 1;
    const response = await TechnicalOperationService.get(payload);
    return response.result.rows || [];
  }

  async getTechnicalOperationsWithBrigades() {
    const payload = {
      needs_brigade: true,
    };
    payload.actual_seasons = 1;
    const response = await TechnicalOperationService.get(payload);
    return response.result.rows || [];
  }

  async getTechnicalOperationsByObjectsType(type) {
    const objects = [];
    const getObjectByTypeName = (objectsType) => {
      switch (objectsType) {
        case 'mixed':
          objects.push({ name: 'ОДХ', id: 1 });
          break;
        case 'simple_dt':
          objects.push({ name: 'ДТ', id: 2 });
          break;
        case 'points':
          objects.push({ name: 'ПН', id: 3 });
          break;
        default:
          break;
      }
    };

    getObjectByTypeName(type);

    const payload = {};

    if (objects.length) {
      payload.objects = objects;
    }
    payload.actual_seasons = 1;
    const response = await TechnicalOperationService.get(payload);
    return response.result.rows || [];
  }

  updateTechnicalOperation(data) {
    const payload = _.cloneDeep(data);
    payload.needs_brigade = !!payload.needs_brigade;
    payload.use_in_reports = !!payload.use_in_reports;
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    delete payload.object_name;
    return TechnicalOperationService.put(payload, getTechnicalOperations, 'json');
  }

}
