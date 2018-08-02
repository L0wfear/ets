import { Actions } from 'flummox';
import { isEmpty } from 'utils/functions';
import { makeUnixTime, createValidDate, createValidDateTime, diffDayOfDate } from 'utils/dates';
import { swapCoords } from 'utils/geo';
import { packObjectData } from 'api/utils';
import {
  Car,
  CarDrivers,
  CarService,
  CarInfoService,
  VectorObjectService,
  TrackService,
  InfoService,
  AutoBase,
} from 'api/Services';

const updateCarInfo = async (id = null, payload, serviceName) => {
  if (id === null) {
    await AutoBase
    .path(serviceName)
    .post(payload, false, 'json');
  } else {
    await AutoBase
    .path(`${serviceName}/${id}`)
    .put({ id, ...payload }, false, 'json');
  }
};

export default class CarActions extends Actions {
  async updateCarAdditionalInfo({
    exploitation_date_start,
    note,
    parking_address,
    asuods_id,
    garage_number = null,
    fuel_correction_rate,
    company_structure_id = null,
    is_common,
    passport_id,
    passport_type = '',
    ...restPayload
  }) {
    const car_id = asuods_id;
    const payload = {
      car_id,
      exploitation_date_start: createValidDate(exploitation_date_start),
      note,
      parking_address,
      garage_number,
      company_structure_id,
      is_common: is_common ? 1 : 0,
      fuel_correction_rate: fuel_correction_rate ? parseFloat(fuel_correction_rate).toFixed(2) : null,
    };

    return Promise.all([
      CarService.put(payload, () => CarService.get().then(r => ({ result: r.result.rows })), 'json'),
      this.updateCarRegisterInfo({
        car_id,
        ...packObjectData('register', restPayload),
      }),
      this.updateCarDriversInfo({
        car_id,
        ...packObjectData('car_drivers', restPayload),
      }),
      () => {
        if (!!passport_type) {
          return this.updateCarPassportInfo({
            car_id,
            type: passport_type.toUpperCase(),
            ...packObjectData(`passport_${passport_type.toLowerCase()}`, restPayload),
            id: passport_id,
          });
        }
        return Promise.resolve(true);
      },
    ]).then(([carData]) => carData);
  }
  getCarRegisterInfo(car_id) {
    return AutoBase
      .path('car_registration_registry')
      .get({ car_id })
      .then(data => data.result.rows[0]);
  }
  getCarPassportRegistryInfo(car_id) {
    return AutoBase
      .path('car_passport_registry')
      .get({ car_id })
      .then(data => data.result.rows[0]);
  }
  getCarDriversInfo(car_id) {
    return CarDrivers
      .get({ car_id });
  }
  updateCarRegisterInfo({
    id,
    certificate_number,
    given_at,
    ...restPayload
  }) {
    const payload = {
      certificate_number,
      given_at: createValidDate(given_at),
      ...restPayload,
    };
    return updateCarInfo(id, payload, 'car_registration_registry');
  }

  updateCarPassportInfo({
    id,
    type,
    given_at,
    ...restPayload
  }) {
    const payload = {
      ...restPayload,
      given_at: createValidDate(given_at),
      type,
    };
    return updateCarInfo(id, payload, `car_passport_${type.toLowerCase()}_registry`);
  }

  updateCarDriversInfo({ car_id, ...restData }) {
    return CarDrivers.path(car_id).put({ car_id, ...restData }, false, 'json');
  }

  getVectorObject(selectedPoint, prevPoint, nextPoint) {
    if (!prevPoint || !selectedPoint || !nextPoint) return { result: null };
    const payload = {
      coordinates: [prevPoint.coords_msk, selectedPoint.coords_msk, nextPoint.coords_msk],
    };
    return VectorObjectService.get(payload);
  }

  getCarsByNormId({ norm_id }) {
    const payload = {
      norm_id,
    };

    return CarService.get(payload);
  }
  getCarsByNormIds({ norm_ids }) {
    const payload = {
      norm_ids,
    };

    return CarService.get(payload);
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

  getCarInfoByDateTime(asuods_id, datetime) {
    const payload = {
      asuods_id,
      datetime: createValidDateTime(datetime),
    };

    return Car.get(payload).then(({ result: { rows: [carData] } }) => carData);
  }

  getCarGpsNumberByDateTime({ asuods_id, gps_code }, datetime) {
    if (diffDayOfDate(new Date(), datetime, 'days', false) > 0) {
      const payloadToCar = {
        asuods_id,
        datetime: createValidDateTime(datetime),
      };

      return Car.get(payloadToCar).then(({ result: { rows: [carData] } }) => carData);
    }

    return Promise.resolve({ gps_code });
  }

  getTrack(carData, from_dt, to_dt) {
    return this.getCarGpsNumberByDateTime(carData, from_dt)
      .then(({ gps_code }) => {
        const payloadToTrack = {
          version: 3,
          gps_code,
          from_dt: makeUnixTime(from_dt),
          to_dt: makeUnixTime(to_dt),
          sensors: 1,
        };

        return TrackService.get(payloadToTrack);
      })
      .then((obj) => {
        const { track = [] } = obj;

        obj.track = track.map((point) => {
            // wrap coords for OpenLayers
          point.coords = swapCoords(point.coords);
          point.coords_msk = swapCoords(point.coords_msk);
          return point;
        });
        return obj;
      });
  }

  getInfoFromCar(gps_code, from_dt, to_dt) {
    const payload = {
      gps_code,
      from_dt: makeUnixTime(from_dt),
      to_dt: makeUnixTime(to_dt),
      version: 3,
    };

    return InfoService.get(payload);
  }

  getCarInfo(car_id, date_start, date_end) {
    const payload = {
      car_id,
      date_start: createValidDateTime(date_start),
      date_end: createValidDateTime(date_end),
    };
    return CarInfoService.get(payload).then(({ result = {} }) => result);
  }

  getCarMissionsByTimestamp(car_id, point_timestamp) {
    const payload = {
      car_id,
      point_timestamp,
    };
    return CarInfoService.get(payload).then(({ result: { missions = [] } }) => missions);
  }

}
