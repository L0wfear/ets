import { Actions } from 'flummox';
import { createValidDateTime } from 'utils/dates';
import _ from 'lodash';
import { isEmpty } from 'utils/functions';
import { WaybillService, LatestWaybillDriverService, WaybillJournalReportService } from 'api/Services';

class WaybillsActions extends Actions {

  constructor(props) {
    super();
  }

  getWaybills() {
    return WaybillService.get();
  }

  deleteWaybill(id) {
    const payload = { id };
    return WaybillService.delete(payload);
  }

  getLatestWaybillDriver(car_id, driver_id) {
    const payload = {};

    if (!isEmpty(car_id)) {
      payload.car_id = car_id;
    }

    if (!isEmpty(driver_id)) {
      payload.driver_id = driver_id;
    }

    return LatestWaybillDriverService.get(payload);
  }

  getWaybill(id) {
    const payload = { id }
    return WaybillService.get(payload);
  }

  getWaybillJournalReport(payload) {
    return WaybillJournalReportService.post(payload, null, 'json');
  }

  updateWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.equipment_fuel = +payload.equipment_fuel;

    if (payload.status === 'closed') {
      payload.fact_departure_date = createValidDateTime(payload.fact_departure_date);
      payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);
    } else {
      payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
      payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    }

    if (payload.tax_data) {
      let tax_data = payload.tax_data.filter((t) => {
        return !isEmpty(t.FACT_VALUE);
      });
      payload.tax_data = JSON.stringify(tax_data);
    }
    if (payload.equipment_tax_data) {
      let equipment_tax_data = payload.equipment_tax_data.filter((t) => {
        return !isEmpty(t.FACT_VALUE);
      });
      payload.equipment_tax_data = JSON.stringify(equipment_tax_data);
    }
    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_equip_diff;
    delete payload.date_create;
    delete payload.car_has_odometer;
    delete payload.could_be_closed;
    delete payload.mission_list;
    delete payload.all_missions_completed_or_failed;
    delete payload.car_special_model_name;
    delete payload.car_model_name;
    delete payload.garage_number;

    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);

    if (isEmpty(payload.motohours_equip_start)) {
      payload.motohours_equip_start = null;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (!isEmpty(payload.mission_id_list) && payload.mission_id_list.length === 0) {
      payload.mission_id_list = [];
    }

    return WaybillService.put(payload, false);
  }

  createWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.equipment_fuel = +payload.equipment_fuel;
    delete payload.car_has_odometer;
    delete payload.mission_list;
    delete payload.car_special_model_name;
    delete payload.car_model_name;
    delete payload.garage_number;
    delete payload.all_missions_completed_or_failed;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : void 0);

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (!isEmpty(payload.mission_id_list) && payload.mission_id_list.length === 0) {
      payload.mission_id_list = [];
    }

    return WaybillService.post(payload);
  }

}

export default WaybillsActions;
