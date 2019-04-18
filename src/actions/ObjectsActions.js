import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import {
  OrderService,
  CarActualService,
  WaybillCarService,
  MissionCarService,
  TypesService,
  WorkMode,
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
    return CarActualService.get(payload).then((r) => ({
      result: r.result.rows,
    }));
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
        return CarActualService.get(payload).then((r) => ({
          result: r.result.rows,
        }));
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
}
