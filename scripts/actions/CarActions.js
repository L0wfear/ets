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

  getVectorObject(selectedPoint, prevPoint, nextPoint) {
    const payload = {
      coordinates: [prevPoint.coords_msk, selectedPoint.coords_msk, nextPoint.coords_msk]
    }
    return VectorObjectService.get(payload, null, 'json');
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
