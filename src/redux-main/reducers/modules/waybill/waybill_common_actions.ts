import {
  WAYBILL_SET_DATA,
} from 'redux-main/reducers/modules/waybill/waybill';
import { IStateWaybill } from 'redux-main/reducers/modules/waybill/@types';

export const actionCompanySetNewData = (newStateData: Partial<IStateWaybill>) => ({
  type: WAYBILL_SET_DATA,
  payload: newStateData,
});
