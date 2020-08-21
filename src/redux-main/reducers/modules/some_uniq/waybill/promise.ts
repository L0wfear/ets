import { WaybillAvailableMissionsService } from 'api/Services';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { isEmpty } from 'utils/functions';
import { SelectedMissionsList } from 'redux-main/reducers/modules/some_uniq/waybill/@types';
import { get } from 'lodash';

const getMissionFilterStatus = (waybillStatus) => {
  return waybillStatus ? undefined : 'not_assigned';
};
type PromiseGetMissionsByCarAndDatesPayload = {
  car_id: Waybill['car_id'];
  date_from: Waybill['fact_departure_date'] | Waybill['plan_departure_date'];
  date_to: Waybill['fact_arrival_date'] | Waybill['plan_arrival_date'];
  status: Waybill['status'];
  waybill_id: Waybill['id'];
};

export const promiseGetMissionsByCarAndDates = async (payloadOwn: PromiseGetMissionsByCarAndDatesPayload) => {
  const payload: Dictionary<any> = {};

  const status = getMissionFilterStatus(payloadOwn.status);

  if (!isEmpty(payloadOwn.car_id)) {
    payload.car_id = payloadOwn.car_id;
  }

  if (!isEmpty(payloadOwn.date_from)) {
    payload.date_from = createValidDateTime(payloadOwn.date_from);
  }

  if (!isEmpty(payloadOwn.date_to)) {
    payload.date_to = createValidDateTime(payloadOwn.date_to);
  }

  if (!isEmpty(status)) {
    payload.status = status;
  }

  if (payloadOwn.waybill_id) {
    payload.waybill_id = payloadOwn.waybill_id;
  }

  const response = await WaybillAvailableMissionsService.get(payload);

  const data: SelectedMissionsList = get(response, 'result.rows', []);

  return data;
};
