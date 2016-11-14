import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { makeUnixTime } from 'utils/dates';
import { swapCoords } from 'utils/geo';
import {
  CarInfoService,
  CarService,
  CarImageService,
  VectorObjectService,
  TrackService,
  TrackDistanceService,
} from 'api/Services';

export default class CarActions extends Actions {

  updateCarAdditionalInfo(car) {
    const payload = {
      car_id: car.asuods_id,
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
    if (car.is_common) {
      payload.is_common = 1;
    } else {
      payload.is_common = 0;
    }

    return CarService.put(payload, CarService.get);
  }

  getVectorObject(selectedPoint, prevPoint, nextPoint) {
    const payload = {
      coordinates: [prevPoint.coords_msk, selectedPoint.coords_msk, nextPoint.coords_msk],
    };
    return VectorObjectService.get(payload);
  }

  async getCarsByTechnicalOperation(technical_operation_id) {
    const payload = {};
    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    } else {
      delete payload.technical_operation_id;
    }
    const response = await CarService.get(payload);
    return response.result.rows || [];
  }

  getTrack(id, from_dt, to_dt) {
    const payload = {
      version: 3,
      gps_code: id,
      from_dt: makeUnixTime(from_dt),
      to_dt: makeUnixTime(to_dt),
    };

    return TrackService
      .get(payload)
      .then((obj) => {
        obj.track = obj.track.map((point) => {
            // wrap coords for OpenLayers
          point.coords = swapCoords(point.coords);
          point.coords_msk = swapCoords(point.coords_msk);
          return point;
        });
        return obj;
      });
  }

  getCarDistance(gps_code, from_dt, to_dt) {
    const payload = {
      gps_code,
      from_dt: makeUnixTime(from_dt),
      to_dt: makeUnixTime(to_dt),
      version: 2,
    };

    return TrackDistanceService.get(payload);
  }

  getCarImage(car_id, type_id, model_id) {
    const payload = {
      car_id,
      type_id,
      model_id,
    };

    return CarImageService.get(payload);
  }

}
