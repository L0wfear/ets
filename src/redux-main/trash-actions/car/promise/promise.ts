import {
  CarService,
} from 'api/Services';
import { createValidDateTime } from 'utils/dates';

export const getCarGpsNumberByDateTime = ({ asuods_id, date_start }) => {
  const payloadToCar = {
    asuods_id,
    datetime: createValidDateTime(date_start),
  };

  return CarService.get(payloadToCar)
    .catch((e) => {
      // tslint:disable-next-line
      console.warn(e);

      return {
        result: {
          rows: [{}],
        },
      };
    }).then(({ result: { rows: [carData] } }) => carData);
};
