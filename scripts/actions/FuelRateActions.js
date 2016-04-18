import { Actions } from 'flummox';
import { createValidDate } from 'utils/dates';
import _ from 'lodash';
import { FuelConsumptionRateService, FuelOperationsService } from 'api/Services';

export default class FuelRateActions extends Actions {

  constructor(props) {
    super();
  }

  getFuelRates() {
    return FuelConsumptionRateService.get();
  }

  getFuelRatesByCarModel(car_model_id) {
    const payload = { car_model_id }
    return FuelConsumptionRateService.get(payload);
  }

  getFuelOperations() {
    return FuelOperationsService.get();
  }

  updateFuelRate(newFuelRate) {
    const payload = _.clone(newFuelRate);
    if (payload.special_model_id && !payload.car_special_model_id)
    payload.car_special_model_id = payload.special_model_id;
    delete payload.rate_on_date;
    delete payload.season;
    delete payload.special_model_name;
    delete payload.special_model_id;
    delete payload.car_model_name;

    if (typeof payload.summer_rate === 'string' && payload.summer_rate.length === 0) {
      payload.summer_rate = null;
    }
    if (typeof payload.winter_rate === 'string' && payload.winter_rate.length === 0) {
      payload.winter_rate = null;
    }
    payload.order_date = createValidDate(payload.order_date);

    return FuelConsumptionRateService.put(payload);
  }

  deleteFuelRate(id) {
    const payload = {
      id
    };
    return FuelConsumptionRateService.delete(payload);
  }

  deleteFuelOperation(id) {
    const payload = {
      id: id
    };
    return FuelOperationsService.delete(payload);
  }

  createFuelOperation(formState) {
    const payload = {};
    if (typeof formState.name === "string" && formState.name !== '' ) {
      payload.name = formState.name;
    }
    return FuelOperationsService.post(payload);
  }

  updateFuelOperation(formState) {
    const payload = {
      id: formState.id
    };
    if (typeof formState.name === "string" && formState.name !== '' ) {
      payload.name = formState.name;
    }
    return FuelOperationsService.put(payload);
  }

  createFuelRate(rate) {
    const payload = _.clone(rate);
    delete payload.car_model_name;
    delete payload.car_special_model_name;
    delete payload.special_model_name;

    payload.order_date = createValidDate(payload.order_date);
    return FuelConsumptionRateService.post(payload);
  }

}
