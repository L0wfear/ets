import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { createValidDateTime } from 'utils/dates';
import { get } from 'lodash';
import {
  OrderService,
  CarService,
  WaybillCarService,
  MissionCarService,
  TypesService,
  UserActionLogService,
  WorkMode,
  MedicalStatsService,
  MissionArchiveCarService,
} from 'api/Services';

export default class ObjectsActions extends Actions {
  getCars(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    return CarService.get(payload).then((r) => ({ result: r.result.rows }));
  }

  getSomeCars(type) {
    const payload = {};
    switch (type) {
      case 'WaybillCarService':
        return WaybillCarService.get(payload).then((r) => ({
          result: r.result,
        }));
      case 'MissionCarService':
        return MissionCarService.get(payload).then((r) => ({
          result: r.result,
        }));
      case 'mission_archive': {
        return MissionArchiveCarService.get(payload).then((r) => ({
          result: r.result,
        }));
      }
      default:
        return CarService.get(payload).then((r) => ({ result: r.result.rows }));
    }
  }

  getTypes(payload = {}) {
    return TypesService.get(payload);
  }

  getWorkMode() {
    return WorkMode.get();
  }

  getOrderById(id) {
    return OrderService.get({ id });
  }

  getUserActionLog(p = {}) {
    const payload = {
      date_start: createValidDateTime(p.date_start),
      date_end: createValidDateTime(p.date_end),
    };
    return UserActionLogService.get(payload).then((response) =>
      get(response, ['result', 'rows'], []).map((d) => {
        d.front_entity_number = d.entity_number;

        return d;
      }),
    );
  }

  getMedicalStats(p = {}) {
    const payload = {
      date_from: createValidDateTime(p.date_from),
      date_to: createValidDateTime(p.date_to),
    };
    return MedicalStatsService.get(payload);
  }
}
