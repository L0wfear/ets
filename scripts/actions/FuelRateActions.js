import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';
import { FuelConsumptionRateService, FuelOperationsService } from 'api/Services';
import { isEmpty } from 'utils/functions';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
  }

  getFuelRates() {
    return FuelConsumptionRateService.get();
  }

  getFuelRatesByCarModel(car_id) {
    const payload = { car_id };
    return FuelConsumptionRateService.get(payload);
  }

  getEquipmentFuelRatesByCarModel(car_id) {
    const payload = {
      car_id,
      for_equipment: 1
    };
    return FuelConsumptionRateService.get(payload);
  }

  getFuelOperations() {
    return FuelOperationsService.get();
  }

  createFuelRate(rate) {
    const payload = _.clone(rate);
    delete payload.car_model_name;
    delete payload.car_special_model_name;

    payload.order_date = createValidDate(payload.order_date);

    _.mapKeys(payload, (v, k) => {
      if (isEmpty(v)) {
        payload[k] = 'null';
      }
    });

    return FuelConsumptionRateService.post(payload, null, 'json');
  }

  updateFuelRate(newFuelRate) {
    const payload = _.clone(newFuelRate);
    delete payload.rate_on_date;
    delete payload.season;
    delete payload.car_model_name;
    delete payload.car_special_model_name;

    payload.order_date = createValidDate(payload.order_date);

    _.mapKeys(payload, (v, k) => {
      if (isEmpty(v)) {
        payload[k] = 'null';
      }
    });


    return FuelConsumptionRateService.put(payload, null, 'json');
  }

  deleteFuelRate(id) {
    const payload = {
      id
    };
    return FuelConsumptionRateService.delete(payload, null, 'json');
  }

  createFuelOperation(formState) {
    const payload = {};
    if (typeof formState.name === "string" && formState.name !== '' ) {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment || false;
    }

    return FuelOperationsService.post(payload);
  }

  updateFuelOperation(formState) {
    const payload = {
      id: formState.id
    };
    if (typeof formState.name === "string" && formState.name !== '' ) {
      payload.name = formState.name;
      payload.equipment = !!formState.equipment || false;
    }
    return FuelOperationsService.put(payload);
  }

  deleteFuelOperation(id) {
    const payload = {
      id: id
    };
    return FuelOperationsService.delete(payload);
  }

}
