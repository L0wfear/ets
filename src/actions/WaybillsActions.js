import { Actions } from 'flummox';
import { createValidDateTime, createValidDate } from 'utils/dates';
import _ from 'lodash';
import {
  hasOdometer,
  isEmpty,
} from 'utils/functions';
import {
  WaybillService,
  LatestWaybillDriverService,
  WaybillJournalReportService,
  WaybillsReportService,
  RootService,
} from 'api/Services';

import { parseFilterObject } from 'actions/MissionsActions.js';

export default class WaybillsActions extends Actions {

  getWaybills(limit = 15, offset = 0, sort_by = ['number:desc'], filter = {}) {
    const payload = {
      limit,
      offset,
      sort_by,
      filter: JSON.stringify(parseFilterObject(_.cloneDeep(filter))),
    };
    return WaybillService.get(payload);
  }

  getLastClosedWaybill(car_id) {
    const payload = {
      car_id,
    };
    return WaybillService.path('closed').get(payload);
  }

  deleteWaybill(id, callback) {
    const payload = { id };
    return WaybillService.delete(payload, callback, 'json');
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
    return WaybillService.path(id).get();
  }

  getWaybillJournalReport(state, filter) {
    const payload = {};

    if (state.formationPeriod === 'month') {
      payload.month = state.month;
      payload.year = state.year;
    }
    if (state.formationPeriod === 'date') {
      payload.date = createValidDate(state.date);
    }

    return WaybillJournalReportService.path(`?filter=${JSON.stringify(parseFilterObject(_.cloneDeep(filter)))}`).postBlob(payload);
  }

  getWaybillsReport(state, filter) {
    const payload = {
      date_start: createValidDateTime(state.date_from),
      date_end: createValidDateTime(state.date_to),
    };

    if (state.with_filter) {
      payload.filter = JSON.stringify(parseFilterObject(_.cloneDeep(filter)));
    }

    return WaybillsReportService.getBlob(payload);
  }

  async printWaybill(print_form_type, waybill_id) {
    const payload = {
      waybill_id,
    };

    let ans = '';

    try {
      ans = await RootService.path(print_form_type).getBlob(payload);
    } catch (error) {
      console.warn('printWaybill', error);
    }

    return ans;
  }

  updateWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.equipment_fuel = +payload.equipment_fuel;

    payload.fact_departure_date = createValidDateTime(payload.fact_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);

    if (payload.tax_data) {
      const tax_data = payload.tax_data.filter(t =>
         !isEmpty(t.FACT_VALUE)
      );
      payload.tax_data = tax_data;
    }
    if (payload.equipment_tax_data) {
      const equipment_tax_data = payload.equipment_tax_data.filter(t =>
         !isEmpty(t.FACT_VALUE)
      );
      payload.equipment_tax_data = equipment_tax_data;
    }

    _.each(['fuel_given', 'equipment_fuel_given'], (key) => {
      if (!isEmpty(payload[key])) {
        payload[key] = parseFloat(payload[key]).toFixed(3);
      }
    });

    delete payload.odometr_diff;
    delete payload.motohours_diff;
    delete payload.motohours_equip_diff;
    delete payload.date_create;
    delete payload.closing_date;
    delete payload.could_be_closed;
    delete payload.mission_list;
    delete payload.all_missions_completed_or_failed;
    delete payload.car_special_model_name;
    delete payload.car_model_name;
    delete payload.garage_number;

    if (!hasOdometer(payload.gov_number)) {
      delete payload.motohours_start;
    } else {
      delete payload.odometr_start;
    }

    _.mapKeys(payload, (v, k) => isEmpty(v) ? payload[k] = null : undefined);

    if (isEmpty(payload.motohours_equip_start)) {
      payload.motohours_equip_start = null;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (!isEmpty(payload.mission_id_list) && payload.mission_id_list.length === 0) {
      payload.mission_id_list = [];
    }

    return WaybillService.put(payload, false, 'json');
  }

  /**
   * Создает ПЛ
   * @param {object} waybill - данные ПЛ
   * @return {promise} POST WaybillService
   */
  createWaybill(waybill) {
    const payload = _.clone(waybill);
    payload.plan_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.fact_departure_date = createValidDateTime(payload.plan_departure_date);
    payload.fact_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.equipment_fuel = +payload.equipment_fuel;
    delete payload.mission_list;
    delete payload.car_special_model_name;
    delete payload.car_model_name;
    delete payload.garage_number;
    delete payload.all_missions_completed_or_failed;
    _.mapKeys(payload, (v, k) => isEmpty(v) ? delete payload[k] : undefined);

    if (!hasOdometer(payload.gov_number)) {
      delete payload.motohours_start;
    } else {
      delete payload.odometr_start;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (!isEmpty(payload.mission_id_list) && payload.mission_id_list.length === 0) {
      payload.mission_id_list = [];
    }

    return WaybillService.post(payload, false, 'json');
  }

}
