import { Actions } from 'flummox';
import _ from 'lodash';
import { TechnicalOperationService, TechnicalOperationObjectsService, TechnicalOperationTypesService } from 'api/Services';
import { isEmpty } from 'utils/functions';

export default class TechnicalOperationsActions extends Actions {

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperationsTypes() {
    return TechnicalOperationTypesService.get();
  }

  getTechnicalOperations(all) {
    return TechnicalOperationService.get({ actual_seasons: all ? 0 : 1 });
  }

  async getTechnicalOperationsByCarId(car_id) {
    const payload = { car_id };
    if (isEmpty(car_id)) {
      delete payload.car_id;
    }
    payload.actual_seasons = 1;
    const response = await TechnicalOperationService.get(payload);
    return response.result || [];
  }

  async getTechnicalOperationsWithBrigades() {
    const payload = {
      needs_brigade: true,
    };
    payload.actual_seasons = 1;
    const response = await TechnicalOperationService.get(payload);
    return response.result || [];
  }

  async getTechnicalOperationsByObjectsType(type) {
    const objects = [];
    const getObjectByTypeName = (type) => {
      switch (type) {
        case 'simple_dt':
          objects.push({ name: 'ОДХ', id: 1 });
          break;
        case 'simple':
          objects.push({ name: 'ДТ', id: 2 });
          break;
        case 'points':
          objects.push({ name: 'ПН', id: 3 });
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
    return response.result || [];
  }

  updateTechnicalOperation(data) {
    const payload = _.cloneDeep(data);
    payload.needs_brigade = !!payload.needs_brigade;
    payload.use_in_reports = !!payload.use_in_reports;
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    delete payload.object_name;
    return TechnicalOperationService.put(payload, null, 'json');
  }

}
