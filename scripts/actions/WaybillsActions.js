import BaseActions from './Actions.js';
import { createValidDateTime } from 'utils/dates';
import _ from 'lodash';
import { isEmpty } from 'utils/functions';
import { WaybillService } from 'api/Services';

class WaybillsActions extends BaseActions {

  constructor(props) {
    super();
    this.service = WaybillService;
  }

  get() {
    return super.get();
  }

  delete(id) {
    return super.delete(id);
  }

  getWaybill(id) {
    const payload = { id }
    return WaybillService.get(payload);
  }

  update(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);

    if (payload.status === 'closed') {
      payload.fact_departure_date = createValidDateTime(payload.fact_departure_date);
      payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);
    } else {
      payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
      payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    }

    if (payload.taxes) {
      let taxes = payload.taxes.filter((t) => {
        return typeof t.FACT_VALUE !== 'undefined';
      });
      if (taxes.length === 0 || taxes.length === 1) {
        delete payload.taxes;
      } else {
        payload.data = JSON.stringify(taxes);
        delete payload.taxes;
      }
    }
    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_equip_diff;
    delete payload.date_create;
    delete payload.car_has_odometer;
    delete payload.could_be_closed;
    delete payload.mission_list;
    delete payload.all_missions_completed_or_failed;

    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);

    if (isEmpty(payload.motohours_equip_start)) {
      payload.motohours_equip_start = null;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = '';
    }

    return super.update(payload, false);
  }

  create(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    delete payload.car_has_odometer;
    delete payload.mission_list;
    delete payload.all_missions_completed_or_failed;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);

    return super.create(payload);
  }

}

export default WaybillsActions;
