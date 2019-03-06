
import { createPath } from 'redux-main/redux-utils';
import { IStateProgramm } from 'redux-main/reducers/modules/repair/state_programm/@types/state_programm';

const STATE_PROGRAMM = createPath('STATE_PROGRAMM');

export const STATE_PROGRAMM_SET_DATA = STATE_PROGRAMM`SET_DATA`;

export const stateProgrammInitialState: IStateProgramm = {};

const stateProgramm = (state = stateProgrammInitialState, { type, payload }) => {
  switch (type) {
    case STATE_PROGRAMM_SET_DATA: {
      return {
        ...state,
        ...payload,
      };
    }
    default: return state;
  }
};

export default stateProgramm;
