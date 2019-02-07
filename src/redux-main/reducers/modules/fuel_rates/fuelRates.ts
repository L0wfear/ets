import { createPath } from 'redux-main/redux-utils';
import { IStateFuelRates } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';

const FUEL_RATES = createPath('FUEL_RATES');

export const FUEL_RATES_SET_DATA = FUEL_RATES`SET_DATA`;

export const initialState: IStateFuelRates = {
  fuelRatesList: [],
  fuelRateOperationsList: [],
  fuelRateOperationsIsActiveList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FUEL_RATES_SET_DATA: {
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
