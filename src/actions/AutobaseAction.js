import { Actions } from 'flummox';
import { cloneDeep } from 'lodash';
import { AutoBase } from 'api/Services';
import AUTOBASE from '../constants/autobase';
import { createValidDate } from '../utils/dates';

const parsePutPath = (entity, method, formState, idKey = 'id') => `${entity}/${method === 'put' ? formState[idKey] : ''}`;

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
}
