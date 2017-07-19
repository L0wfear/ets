import { Actions } from 'flummox';
import { cloneDeep, get } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase.js';
import { createValidDate } from '../utils/dates';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;

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

  battery(method, formState) {
    const payload = {
      ...formState,
      battery_to_car: get(formState, 'battery_to_car', []).map(item => ({
        car_id: item.car_id,
        installed_at: createValidDate(item.installed_at),
        uninstalled_at: createValidDate(item.uninstalled_at),
      })),
    };
    payload.released_at = createValidDate(payload.released_at);

    const { btr } = AUTOBASE;
    const path = parsePutPath(btr, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'btr'),
      'json',
    );
  }

  removeBattery(id) {
    const { btr } = AUTOBASE;

    return AutoBase.path(`${btr}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'btr'),
      'json',
    );
  }

  async getSparePartGroup() {
    const payload = {};

    const response = await AutoBase.path('spare_part_group').get(payload);

    return response.result.rows || [];
  }

  async getSparePartMeasureUnit() {
    const payload = {};

    const response = await AutoBase.path('measure_unit').get(payload);

    return response.result.rows || [];
  }

  sparePart(method, formState) {
    const payload = cloneDeep(formState);
    const { sparePart } = AUTOBASE;

    return AutoBase.path(sparePart)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'sparePart'),
      'json',
    );
  }

  tire(method, formState) {
    const payload = {
      ...formState,
      tire_to_car: get(formState, 'tire_to_car', []).map(item => ({
        ...item,
        installed_at: createValidDate(item.installed_at),
        uninstalled_at: createValidDate(item.uninstalled_at),
      })),
    };
    const { tire } = AUTOBASE;
    const path = parsePutPath(tire, method, formState);

    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }
  removeTire(id) {
    const { tire } = AUTOBASE;
    return AutoBase.path(tire).path(id).delete(
      {},
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }

  batteryBrand(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryBrand } = AUTOBASE;

    return AutoBase.path(batteryBrand)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryBrand'),
      'json',
    );
  }

  batteryManufacturer(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryManufacturer } = AUTOBASE;

    return AutoBase.path(batteryManufacturer)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryManufacturer'),
      'json',
    );
  }

  deleteLineFromSarePart(formState) {
    const payload = { id: formState };
    const type = 'sparePart';

    const trueType = AUTOBASE[type];

    return AutoBase.path(trueType).delete(
      payload,
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }
}
