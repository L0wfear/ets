import { Actions } from 'flummox';
import { cloneDeep, get, omit } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate } from '../utils/dates';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;
const clearPayload = state => omit(state, ['rowNumber', 'isHighlighted', 'isSelected']);

export default class EmployeesActions extends Actions {

  async getAutobaseListByType(type, data) {
    const trueType = AUTOBASE[type];
    const payload = {
      ...data,
    };

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
    };
  }

  batteryRegistry(method, formState) {
    const payload = {
      ...formState,
      battery_to_car: get(formState, 'battery_to_car', []).map(item => ({
        car_id: item.car_id,
        installed_at: createValidDate(item.installed_at),
        uninstalled_at: createValidDate(item.uninstalled_at),
      })),
    };
    payload.released_at = createValidDate(payload.released_at);

    const { batteryRegistry } = AUTOBASE;
    const path = parsePutPath(batteryRegistry, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryRegistry'),
      'json',
    );
  }

  tire(method, formState) {
    const cleanFormState = clearPayload(formState);

    const payload = {
      ...cleanFormState,
      tire_to_car: get(cleanFormState, 'tire_to_car', []).map(item => ({
        ...clearPayload(item),
        installed_at: createValidDate(item.installed_at),
        uninstalled_at: createValidDate(item.uninstalled_at),
      })),
    };
    const { tire } = AUTOBASE;
    const path = parsePutPath(tire, method, cleanFormState);

    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }

  cloneTire(id) {
    const { tire } = AUTOBASE;
    return AutoBase.path(`${tire}/${id}/copy`).post(
      {},
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }

  techMaintOrder(method, formState) {
    const payload = cloneDeep(formState);
    const { techMaintOrder } = AUTOBASE;

    return AutoBase.path(techMaintOrder)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'techMaintOrder'),
      'json',
    );
  }
  removeTechMaintOrder(id) {
    const { techMaintOrder } = AUTOBASE;
    return AutoBase.path(`${techMaintOrder}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'techMaintOrder'),
      'json',
    );
  }

  changeDataInDB(type, method, formState) {
    const payload = Object.entries(formState).reduce((obj, [key, value]) => {
      if (key.includes('date')) {
        obj[key] = createValidDate(value);
      } else {
        obj[key] = value;
      }
      return obj;
    }, {});

    const trueType = AUTOBASE[type];

    return AutoBase.path(trueType)[method](
      payload,
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }
  removeDataFromDB(type, id) {
    const trueType = AUTOBASE[type];

    return AutoBase.path(`${trueType}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }
}
