import { Actions } from 'flummox';
import { cloneDeep, get, omit } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase';
import { createValidDate } from '../utils/dates';
import { AUTOBASE_REPAIR_STATUS } from '../constants/dictionary';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;
const clearPayload = (state) => omit(state, ['rowNumber', 'isHighlighted', 'isSelected']);

export default class AutobaseActions extends Actions {
  async getAutobaseListByType(type, data, other) {
    const trueType = AUTOBASE[type];
    const payload = {
      ...data,
    };

    const response = await AutoBase.path(trueType).get(payload);

    return {
      type,
      data: response,
      ...other,
    };
  }

  insurancePolicy(method, boundPayload, formState) {
    const payload = {
      ...formState,
    };

    ['created_at', 'updated_at', 'date_start', 'date_end'].forEach((key) => {
      if (formState[key]) {
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
    const { repair } = AUTOBASE;
    const path = parsePutPath(repair, method, formState);

    const payload = Object.entries(formState).reduce((obj, [key, value]) => {
      if (key.includes('date')) {
        obj[key] = createValidDate(value);
      } else {
        obj[key] = value;
      }
      return obj;
    }, {});

    if (!AUTOBASE_REPAIR_STATUS.passed.has.reduce((bool, key) => bool && !!payload[key], true)) {
      if (AUTOBASE_REPAIR_STATUS.in_progress.has.reduce((bool, key) => bool && payload[key], true)) {
        payload.status = 'in_progress';
      } else if (AUTOBASE_REPAIR_STATUS.planned.has.reduce((bool, key) => bool && payload[key], true)) {
        payload.status = 'planned';
      } else {
        delete payload.status;
      }
    }

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

  repairCompany(method, formState) {
    const payload = { ...formState };
    const { repairCompany } = AUTOBASE;

    const path = parsePutPath(repairCompany, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'repairCompany'),
      'json',
    );
  }

  removeRepairCompany(id) {
    const { repairCompany } = AUTOBASE;
    return AutoBase.path(`${repairCompany}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'repairCompany'),
      'json',
    );
  }

  roadAccident(method, boundPayload, formState) {
    const payload = {
      ...formState,
      accident_date: createValidDate(formState.accident_date),
      is_guilty: !!formState.is_guilty,
    };
    const { roadAccidentRegistry } = AUTOBASE;

    const path = parsePutPath(roadAccidentRegistry, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'roadAccidentRegistry', boundPayload),
      'json',
    );
  }

  removeRoadAccident(boundPayload, id) {
    const { roadAccidentRegistry } = AUTOBASE;

    return AutoBase.path(`${roadAccidentRegistry}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'roadAccidentRegistry', boundPayload),
      'json',
    );
  }

  techInspection(method, boundPayload, formState) {
    const payload = {
      ...formState,
      date_start: createValidDate(formState.date_start),
      date_end: createValidDate(formState.date_end),
      is_allowed: !!formState.is_allowed,
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
      tire_to_car: get(cleanFormState, 'tire_to_car', []).map((item) => ({
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

  tireModel(method, formState) {
    const payload = cloneDeep(formState);
    const { tireModel } = AUTOBASE;

    const path = parsePutPath(tireModel, method, formState);
    return AutoBase.path(path)[method](
      payload,
      this.getAutobaseListByType.bind(null, 'tireModel'),
      'json',
    );
  }

  removeTireModel(id) {
    const { tireModel } = AUTOBASE;
    return AutoBase.path(`${tireModel}/${id}`).delete(
      {},
      this.getAutobaseListByType.bind(null, 'tireModel'),
      'json',
    );
  }
}
