import {
  Car,
} from 'api/Services';
import { diffDayOfDate, createValidDateTime } from 'utils/dates';

export const getCarGpsNumberByDateTime = ({ asuods_id, gps_code, date_start }) => {
  if (diffDayOfDate(new Date(), date_start) > 0) {
    const payloadToCar = {
      asuods_id,
      datetime: createValidDateTime(date_start),
    };

    return Car.get(payloadToCar).then(({ result: { rows: [carData] } }) => carData);
  }

  return Promise.resolve({ gps_code });
};
