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
    delete payload.rate_on_date;
    delete payload.season;

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
      ID: id
    };
    return FuelOperationsService.delete(payload);
  }

  createFuelOperation(formState) {
    const payload = {};
    if (typeof formState.NAME === "string" && formState.NAME !== '' ) {
      payload.NAME = formState.NAME;
    }
    return FuelOperationsService.post(payload);
  }

  updateFuelOperation(formState) {
    const payload = {
      ID: formState.ID
    };
    if (typeof formState.NAME === "string" && formState.NAME !== '' ) {
      payload.NAME = formState.NAME;
    }
    return FuelOperationsService.put(payload);
  }

  createFuelRate(rate) {
    const payload = _.clone(rate);
    delete payload.car_model_name;
    payload.order_date = createValidDate(payload.order_date);
    return FuelConsumptionRateService.post(payload);
  }

}
