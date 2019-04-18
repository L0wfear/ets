import { Actions } from 'flummox';
import {
  TechnicalOperationObjectsService,
  TechnicalOperationRegistryService,
} from 'api/Services';

function getTechnicalOperations(payload = {}) {
  return TechnicalOperationRegistryService.get(payload).then((r) => ({
    result: r.result.rows,
  }));
}

export default class TechnicalOperationsActions extends Actions {
  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperations(data) {
    const payload = { ...data };

    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }
    if (!payload.car_id) {
      delete payload.car_id;
    }

    return getTechnicalOperations(payload);
  }
}
