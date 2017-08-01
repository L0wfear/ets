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

  batteryBrand(method, formState) {
    const payload = cloneDeep(formState);
    const { batteryBrand } = AUTOBASE;

    const path = parsePutPath(batteryBrand, method, formState);
    return AutoBase.path(path)[method](
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

    const path = parsePutPath(batteryManufacturer, method, formState);
    return AutoBase.path(path)[method](
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
  removeBatteryRegistry(id) {
    const { batteryRegistry } = AUTOBASE;
    return AutoBase.path(`${batteryRegistry}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'batteryRegistry'),
      'json',
    );
  }

  insurancePolicy(method, boundPayload, formState) {
    const payload = {
      ...formState,
    };
    ['created_at', 'updated_at', 'date_start', 'date_end'].forEach((key) => {
      if (formState.hasOwnProperty(key)) {
        payload[key] = createValidDate(formState[key]);
      }
    });
    const { insurancePolicy } = AUTOBASE;

    const path = parsePutPath(insurancePolicy, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'insurancePolicy', boundPayload),
      'json',
    );
  }
  removeInsurancePolicy(boundPayload, id) {
    const { insurancePolicy } = AUTOBASE;

    return AutoBase.path(`${insurancePolicy}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'insurancePolicy', boundPayload),
      'json',
    );
  }

  repair(method, boundPayload, formState) {
    const payload = Object.entries(formState).reduce((obj, [key, value]) => {
      if (key.includes('date')) {
        obj[key] = createValidDate(value);
      } else {
        obj[key] = value;
      }
      return obj;
    }, {});

    const { repair } = AUTOBASE;

    const path = parsePutPath(repair, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'repair', boundPayload),
      'json',
    );
  }
  removeRepair(boundPayload, id) {
    const { repair } = AUTOBASE;

    return AutoBase.path(`${repair}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'repair', boundPayload),
      'json',
    );
  }

  sparePart(method, formState) {
    const payload = {
      ...formState,
      supplied_at: createValidDate(formState.supplied_at),
    };
    const { sparePart } = AUTOBASE;

    const path = parsePutPath(sparePart, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'sparePart'),
      'json',
    );
  }
  removeSparePart(id) {
    const { sparePart } = AUTOBASE;
    return AutoBase.path(`${sparePart}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'sparePart'),
      'json',
    );
  }

  techInspection(method, boundPayload, formState) {
    const payload = {
      ...formState,
      date_start: createValidDate(formState.date_start),
      date_end: createValidDate(formState.date_end),
    };

    const { techInspection } = AUTOBASE;

    const path = parsePutPath(techInspection, method, formState);

    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'techInspection', boundPayload),
      'json',
    );
  }
  removeTechInspection(boundPayload, id) {
    const { techInspection } = AUTOBASE;

    return AutoBase.path(`${techInspection}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'techInspection', boundPayload),
      'json',
    );
  }

  techMaintOrder(method, formState) {
    const payload = cloneDeep(formState);
    const { techMaintOrder } = AUTOBASE;

    const path = parsePutPath(techMaintOrder, method, formState);
    return AutoBase.path(path)[method](
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

  techMaint(method, boundPayload, formState) {
    const payload = cloneDeep(formState);
    const { techMaint } = AUTOBASE;

    const formatedPayload = {
      ...payload,
      plan_date_start: createValidDate(payload.plan_date_start),
      plan_date_end: createValidDate(payload.plan_date_end),
      fact_date_start: createValidDate(payload.fact_date_start),
      fact_date_end: createValidDate(payload.fact_date_end),
    };

    const path = parsePutPath(techMaint, method, formState);
    return AutoBase.path(path)[method](
      formatedPayload,
      this.getAutobaseListByType.bind(null, 'techMaint', boundPayload),
      'json',
    );
  }
  removeTechMaint(boundPayload, id) {
    const { techMaint } = AUTOBASE;
    return AutoBase.path(`${techMaint}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'techMaint', boundPayload),
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
  removeTire(id) {
    const { tire } = AUTOBASE;

    return AutoBase.path(`${tire}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'tire'),
      'json',
    );
  }
}
