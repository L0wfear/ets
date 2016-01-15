import { Actions } from 'flummox';
import { updateCarGarageNumber } from '../adapter.js';
import _ from 'lodash';

export default class CarActions extends Actions {

  updateCarGarageNumber(car) {
    const payload = {
      car_id: car.asuods_id,
      garage_number: car.garage_number,
    };

    return updateCarGarageNumber(payload);
  }

}
