import { createPath } from 'redux-main/redux-utils';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

const MISSIONS = createPath('MISSIONS');

export const MISSIONS_SET_DATA = MISSIONS`SET_DATA`;

const initialState: IStateMissions = {
  missionTemplateList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case MISSIONS_SET_DATA: {
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
