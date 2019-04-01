import { Actions } from 'flummox';
import {
  TechnicalOperationObjectsService,
  TechnicalOperationRelationsService,
  TechnicalOperationRegistryService,
} from 'api/Services';
import { Cleaning } from 'api/missions';

function getTechnicalOperations(payload = {}) {
  return TechnicalOperationRegistryService.get(payload).then((r) => ({
    result: r.result.rows,
  }));
}

function getTechnicalOperationsRegistry(payload = {}) {
  return Cleaning.path('norm_registry')
    .get(payload)
    .then((r) => ({
      result: r.result.rows.map((rowData, index) => {
        rowData.front_custom_id = index + 1;

        return rowData;
      }),
    }));
}

export default class TechnicalOperationsActions extends Actions {
  getTechOperationsByNormIds(outerPayload) {
    const payload = { ...outerPayload };
    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }

    return getTechnicalOperationsRegistry(payload, false, 'json');
  }

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperationRelations(props) {
    const payload = {
      technical_operation_id: props.technical_operation_id,
      municipal_facility_id: props.municipal_facility_id,
      route_types: props.route_types,
      func_type_id: props.func_type_id,
    };
    return TechnicalOperationRelationsService.get(payload).then(
      ({ result: { rows } }) => ({ result: rows }),
    );
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
