import { Actions } from 'flummox';
import { logout } from '../adapter.js';
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

  getTechnicalOperations(payload = {}) {
    return TechnicalOperationService.get();
  }

  async getTechnicalOperationsByCarId(car_id) {
    const payload = { car_id };
    if (isEmpty(car_id)) {
      delete payload.car_id;
    }
    let response = await TechnicalOperationService.get(payload);
    return response.result || [];
  }

  async getTechnicalOperationsWithBrigades() {
    const payload = {
      needs_brigade: true,
    };
    let response = await TechnicalOperationService.get(payload);
    return response.result || [];
  }

  updateTechnicalOperation(data) {
    const payload = _.cloneDeep(data);
    payload.needs_brigade = !!payload.needs_brigade;
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    delete payload.object_name;
    return TechnicalOperationService.put(payload, null, 'json');
  }

}
