import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import {
  OrderService,
  CarActualService,
  WaybillCarService,
  TypesService,
  WorkMode,
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

  getWaybillSomeCars() {
    return WaybillCarService.get({}).then((r) => ({
      result: r.result,
    }));
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
