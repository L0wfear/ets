import { Actions } from 'flummox';
import { logout } from '../adapter.js';
import _ from 'lodash';
import { TechnicalOperationService, TechnicalOperationObjectsService } from 'api/Services';

export default class TechnicalOperationsActions extends Actions {

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperations(payload = {}) {
    return TechnicalOperationService.get();
  }

  updateTechnicalOperation(data) {
    const payload = _.cloneDeep(data);
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    return TechnicalOperationService.put(payload, null, 'json');
  }

}
