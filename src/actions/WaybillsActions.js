import { Actions } from 'flummox';
import { createValidDateTime } from 'utils/dates';
import { clone, mapKeys } from 'lodash';
import { hasMotohours, isEmpty } from 'utils/functions';
import {
  WaybillService,
  LatestWaybillDriverService,
  RootService,
} from 'api/Services';

const updateFieldsToTest = ['fuel_given', 'equipment_fuel_given'];

export default class WaybillsActions extends Actions {
  getLastClosedWaybill(car_id) {
    const payload = {
      car_id,
    };
    return WaybillService.path('closed').get(payload);
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
    return WaybillService.path(id)
      .get()
      .then(({ result }) => {
        const waybill = result;
        if (waybill && waybill.tax_data) {
          waybill.tax_data = waybill.tax_data.map((tax) => {
            tax.originOperation = true;
            tax.uniqKey = `originOperation_${tax.OPERATION}`;
            tax.operation_name = `${tax.operation_name}, ${
              tax.measure_unit_name
            }`;
            if (tax.comment) {
              tax.operation_name = `${tax.operation_name} (${tax.comment})`;
            }
            if (tax.is_excluding_mileage) {
              tax.operation_name = `${tax.operation_name} [без учета пробега]`;
            }
            return tax;
          });
        }
        if (waybill && waybill.equipment_tax_data) {
          waybill.equipment_tax_data = waybill.equipment_tax_data.map((tax) => {
            tax.originOperation = true;
            tax.uniqKey = `originOperation_${tax.OPERATION}`;
            tax.operation_name = `${tax.operation_name}, ${
              tax.measure_unit_name
            }`;
            if (tax.comment) {
              tax.operation_name = `${tax.operation_name} (${tax.comment})`;
            }
            if (tax.is_excluding_mileage) {
              tax.operation_name = `${tax.operation_name} [без учета пробега]`;
            }
            return tax;
          });
        }

        return {
          result: waybill,
        };
      });
  }

  printWaybill(print_form_type, waybill_id) {
    const payload = {
      waybill_id,
    };

    return RootService.path(print_form_type).getBlob(payload);
  }

  updateWaybill(waybill) {
    const payload = clone(waybill);
    payload.plan_departure_date = createValidDateTime(
      payload.plan_departure_date,
    );
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);
    payload.equipment_fuel = +payload.equipment_fuel;

    payload.fact_departure_date = createValidDateTime(
      payload.fact_departure_date,
    );
    payload.fact_arrival_date = createValidDateTime(payload.fact_arrival_date);

    if (payload.tax_data) {
      const tax_data = payload.tax_data
        .filter((t) => !isEmpty(t.FACT_VALUE))
        .map((tax) => {
          delete tax.originOperation;
          delete tax.isDisabled;
          delete tax.operation_name;
          delete tax.uniqKey;

          return tax;
        });
      payload.tax_data = tax_data;
    }
    if (payload.equipment_tax_data) {
      const equipment_tax_data = payload.equipment_tax_data
        .filter((t) => !isEmpty(t.FACT_VALUE))
        .map((tax) => {
          delete tax.originOperation;
          delete tax.isDisabled;
          delete tax.operation_name;
          delete tax.uniqKey;

          return tax;
        });
      payload.equipment_tax_data = equipment_tax_data;
    }

    updateFieldsToTest.forEach((key) => {
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
    delete payload.hasEquipmentFuelRates;

    if (hasMotohours(payload.gov_number)) {
      delete payload.odometr_start;
    } else {
      delete payload.motohours_start;
    }

    mapKeys(payload, (v, k) => {
      if (isEmpty(v)) {
        payload[k] = null;
      }
    });

    if (isEmpty(payload.motohours_equip_start)) {
      payload.motohours_equip_start = null;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (
      !isEmpty(payload.mission_id_list)
      && payload.mission_id_list.length === 0
    ) {
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
    const payload = clone(waybill);
    payload.plan_departure_date = createValidDateTime(
      payload.plan_departure_date,
    );
    payload.plan_arrival_date = createValidDateTime(payload.plan_arrival_date);

    payload.equipment_fuel = +payload.equipment_fuel;
    delete payload.mission_list;
    delete payload.car_special_model_name;
    delete payload.car_model_name;
    delete payload.garage_number;
    delete payload.all_missions_completed_or_failed;
    delete payload.hasEquipmentFuelRates;

    mapKeys(payload, (v, k) => (isEmpty(v) ? delete payload[k] : undefined));

    if (hasMotohours(payload.gov_number)) {
      delete payload.odometr_start;
    } else {
      delete payload.motohours_start;
    }

    if (isEmpty(payload.mission_id_list)) {
      payload.mission_id_list = [];
    }

    if (
      !isEmpty(payload.mission_id_list)
      && payload.mission_id_list.length === 0
    ) {
      payload.mission_id_list = [];
    }

    return WaybillService.post(payload, false, 'json');
  }
}
