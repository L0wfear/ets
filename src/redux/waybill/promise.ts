import {
  WaybillService,
} from 'api/Services';

export const getWaybillById = (id) => (
  WaybillService.path(id).get()
    .catch((error) => {
      console.warn(error);

      return {
        result: null,
      }
    })
    .then(({ result }) => ({
      waybill_data: result,
    }))
);