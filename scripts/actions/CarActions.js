import { Actions } from 'flummox';
import { CarInfoService, CarService, VectorObjectService } from 'api/Services';
import { isEmpty } from 'utils/functions';
import { getTrack } from '../adapter.js';

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
    if (car.company_structure_id) {
      payload.company_structure_id = car.company_structure_id;
    }

    return CarInfoService.post(payload, CarService.get);
  }

  getVectorObject(start, end, type) {
    const payload = {
      start_x: start[0],
      start_y: start[1],
      end_x: end[0],
      end_y: end[1],
      route_type: type
    }
    return VectorObjectService.get(payload);
  }

  async getCarsByTechnicalOperation(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    let response = await CarService.get(payload);
    return response.result || [];
  }

  getTrack(id, from_dt, to_dt) {
    return getTrack(id, from_dt, to_dt);
  }

}
