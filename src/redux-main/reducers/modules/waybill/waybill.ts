import { createPath } from 'redux-main/redux-utils';
import { IStateWaybill } from 'redux-main/reducers/modules/waybill/@types';

const WAYBILL = createPath('WAYBILL');

export const WAYBILL_SET_DATA = WAYBILL`SET_DATA`;

const initialState: IStateWaybill = {
  waybillList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case WAYBILL_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};
