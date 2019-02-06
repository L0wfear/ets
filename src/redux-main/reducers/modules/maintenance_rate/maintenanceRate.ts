import { createPath } from 'redux-main/redux-utils';
import { IStateMaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';

const MAINTENANCE_RATE = createPath('MAINTENANCE_RATE');

export const MAINTENANCE_RATE_SET_DATA = MAINTENANCE_RATE`SET_DATA`;

const initialState: IStateMaintenanceRate = {
  maintenanceRateList: [],
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
