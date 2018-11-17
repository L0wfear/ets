import {
  WaybillService,
} from 'api/Services';

export const getWaybillById = (id) => (
  WaybillService.path(id).get()
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: null,
      };
    })
    .then(({ result }) => ({
      waybill_data: result,
    }))
);

export const getWaybill = (id) => (
  WaybillService.path(id).get()
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        result: null,
      };
    })
    .then(({ result }) => ({
      waybill_data: result,
    }))
);
