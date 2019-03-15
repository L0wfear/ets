import { createPath } from 'redux-main/redux-utils';
import { IStateMaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';

const MAINTENANCE_RATE = createPath('MAINTENANCE_RATE');

export const MAINTENANCE_RATE_SET_DATA = MAINTENANCE_RATE`SET_DATA`;

const initialState: IStateMaterialConsumptionRate = {
  materialConsumptionRateList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case MAINTENANCE_RATE_SET_DATA: {
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
