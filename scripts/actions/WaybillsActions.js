import { Actions } from 'flummox';
import { getWaybills, removeWaybill, updateWaybill, createWaybill } from '../adapter.js';
import { createValidDateTime } from '../utils/dates.js';
import _ from 'lodash';
import { isEmpty } from '../utils/functions.js';

export default class WaybillsActions extends Actions {

  constructor(props) {
    super();
  }

  getWaybills() {
    return getWaybills();
  }

  removeWaybill(id) {
    const payload = { id };
    return removeWaybill(payload);
  }

  updateWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDateTime(payload.fact_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);
    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_equip_diff;
    delete payload.date_create;

    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);
    if (isEmpty(payload.motohours_equip_start)) {
      payload.motohours_equip_start = null;
    }

    return updateWaybill(payload);
  }

  createWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);

    return createWaybill(payload);
  }

}
