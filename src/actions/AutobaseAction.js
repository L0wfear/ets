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

    const { batteryRegistry } = AUTOBASE;
    const path = parsePutPath(batteryRegistry, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryRegistry'),
      'json',
    );
  }

  removeBattery(id) {
    const { batteryRegistry } = AUTOBASE;

    return AutoBase.path(`${batteryRegistry}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'batteryRegistry'),
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

  techInspection(method, formState) {
    const payload = cloneDeep(formState);
    const { techInspection } = AUTOBASE;

    return AutoBase.path(techInspection)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'techInspection'),
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
  removeTire(id) {
    const { tire } = AUTOBASE;
    return AutoBase.path(`${tire}/${id}`).delete(
      {},
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

  batteryBrand(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryBrand } = AUTOBASE;

    return AutoBase.path(batteryBrand)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'batteryBrand'),
      'json',
    );
  }
  removeBatteryBrand(id) {
    const { batteryBrand } = AUTOBASE;
    return AutoBase.path(`${batteryBrand}/${id}`).delete(
      {},
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
  removeBatteryManufacturer(id) {
    const { batteryManufacturer } = AUTOBASE;
    return AutoBase.path(`${batteryManufacturer}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'batteryManufacturer'),
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

  removeTechInspection(formState) {
    const payload = { car_id: formState };
    const type = 'techInspection';

    const trueType = AUTOBASE[type];

    return AutoBase.path(trueType).delete(
      payload,
      this.getAutobaseListByType.bind(null, type),
      'json',
    );
  }

  insurancePolicy(method, formState) {
    const payload = {
      ...formState,
      date_start: createValidDate(formState.date_start),
      date_end: createValidDate(formState.date_end),
    };

    const { insurancePolicy } = AUTOBASE;

    return AutoBase.path(insurancePolicy)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'insurancePolicy'),
      'json',
    );
  }

  removeInsurancePolicy(id) {
    const { batteryBrand } = AUTOBASE;
    return AutoBase.path(`${batteryBrand}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'techInspection'),
      'json',
    );
  }
}
