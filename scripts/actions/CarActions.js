import { Actions } from 'flummox';
import { CarInfoService, CarService } from 'api/Services';

export default class CarActions extends Actions {

  updateCarAdditionalInfo(car) {
    const payload = {
      car_id: car.asuods_id
    };

    if (car.garage_number) {
      payload.garage_number = car.garage_number;
    }
    if (car.fuel_correction_rate) {
      payload.fuel_correction_rate = parseFloat(car.fuel_correction_rate).toFixed(2);
    }

    return CarInfoService.post(payload, CarService.get);
  }

}
