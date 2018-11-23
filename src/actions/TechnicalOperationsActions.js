import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import {
  TechnicalOperationObjectsService,
  TechnicalOperationRelationsService,
  TechnicalOperationTypesService,
  TechnicalOperationRegistryService,
} from 'api/Services';
import {
  Cleaning,
} from 'api/missions';

function getTechnicalOperations(payload = {}) {
  return TechnicalOperationRegistryService.get(payload).then(r => ({ result: r.result.rows }));
}

function getTechnicalOperationsRegistry(payload = {}) {
  return Cleaning.path('norm_registry').get(payload).then(r => ({ result: r.result.rows }));
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

  getTechnicalOperationsTypes() {
    return TechnicalOperationTypesService.get();
  }

  getTechnicalOperationRelations(props) {
    const payload = {
      technical_operation_id: props.technical_operation_id,
      municipal_facility_id: props.municipal_facility_id,
      route_types: props.route_types,
      func_type_id: props.func_type_id,
    };
    return TechnicalOperationRelationsService.get(payload).then(({ result: { rows } }) => ({ result: rows }));
  }

  getTechnicalOperations(data) {
    const payload = { ...data };

    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }

    return getTechnicalOperations(payload);
  }

  getTechnicalOperationsRegistry() {
    const payload = {};
    return getTechnicalOperationsRegistry(payload);
  }

  async getTechnicalOperationsWithBrigades(data) {
    const payload = {
      needs_brigade: true,
      ...data,
    };

    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }

    const response = await TechnicalOperationRegistryService.get(payload);
    return response.result.rows || [];
  }

  updateTechnicalOperation(data) {
    const payload = cloneDeep(data);
    payload.needs_brigade = !!payload.needs_brigade;
    payload.use_in_reports = !!payload.use_in_reports;
    delete payload.season_name;
    delete payload.work_kind_name;
    delete payload.check_type_name;
    delete payload.object_name;
    delete payload.object_text;

    return Cleaning.path('norm_registry').path(data.id).put(payload, getTechnicalOperationsRegistry, 'json');
  }
}
