import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { makeUnixTime, createValidDateTime } from 'utils/dates';
import { swapCoords } from 'utils/geo';
import {
  CarService,
  CarInfoService,
  VectorObjectService,
  TrackService,
  InfoService,
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

    return CarService.put(payload, () => CarService.get().then(r => ({ result: r.result.rows })), 'json');
  }

  getVectorObject(selectedPoint, prevPoint, nextPoint) {
    if (!prevPoint || !selectedPoint || !nextPoint) return { result: null };
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
      sensors: 1,
      // test: 1, //временно
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

  getCarInfo(gps_code, from_dt, to_dt) {
    const payload = {
      gps_code,
      from_dt: makeUnixTime(from_dt),
      to_dt: makeUnixTime(to_dt),
      version: 3,
    };

    return InfoService.get(payload);
  }

  getCarMissions(car_id) {
    const payload = {
      car_id,
    };
    return CarInfoService.get(payload).then(r => ({ result: r.result.missions }));
  }

  getCarMissionsByTimestamp(car_id, point_timestamp) {
    const payload = {
      car_id,
      point_timestamp,
    };
    return CarInfoService.get(payload).then(r => ({ result: r.result.missions }));
  }

}
