import { createPath } from 'redux-main/redux-utils';
import { StateFuelCards } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

const FUEL_CARDS = createPath('FUEL_CARDS');

export const SESSION_SET_DATA = FUEL_CARDS`SET_DATA`;

const initialState: StateFuelCards = {
  fuelCardsList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SESSION_SET_DATA: {
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
