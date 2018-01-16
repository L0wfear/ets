import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import {
  TechnicalOperationObjectsService,
  TechnicalOperationTypesService,
  TechnicalOperationRegistryService,
} from 'api/Services';
import {
  Cleaning,
} from 'api/missions';

import { isEmpty } from 'utils/functions';

function getTechnicalOperations(payload = {}) {
  return TechnicalOperationRegistryService.get(payload).then(r => ({ result: r.result.rows }));
}

function getTechnicalOperationsRegistry(payload = {}) {
  return Cleaning.path('norm_registry').get(payload).then(r => ({ result: r.result.rows }));
}

export default class TechnicalOperationsActions extends Actions {
  getOneTechOperationByNormId({ norm_id }) {
    return getTechnicalOperationsRegistry({ norm_id }, false, 'json');
  }

  getTechnicalOperationsObjects() {
    return TechnicalOperationObjectsService.get();
  }

  getTechnicalOperationsTypes() {
    return TechnicalOperationTypesService.get();
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

  async getTechnicalOperationsByCarId(car_id) {
    const payload = { car_id };
    if (isEmpty(car_id)) {
      delete payload.car_id;
    }
    const response = await TechnicalOperationRegistryService.get(payload);
    return response.result.rows || [];
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
    return TechnicalOperationRegistryService.put(payload, getTechnicalOperations, 'json');
  }

}
