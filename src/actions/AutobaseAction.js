import { Actions } from 'flummox';
import { cloneDeep, get, omit } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase';
import { createValidDate } from '../utils/dates';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;
const clearPayload = state => omit(state, ['rowNumber', 'isHighlighted', 'isSelected']);

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
