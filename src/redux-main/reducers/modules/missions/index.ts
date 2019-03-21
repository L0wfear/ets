import { createPath } from 'redux-main/redux-utils';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

const MISSIONS = createPath('MISSIONS');

export const MISSIONS_SET_DATA = MISSIONS`SET_DATA`;

export const initialMissionsState: IStateMissions = {
  missionTemplateList: [],
  carForMissionTemplateList: [],
  carForMissionTemplateIndex: {},

  dutyMissionTemplateList: [],

  dutyMissionData: {
    dutyMissionList: [],
    dependeceOrder: null,
    edcRequest: null,
    dependeceTechnicalOperation: null,
    availableMissionsToBind: [],
    total_count: 0,
  },
  missionData: {
    list: [],
    edcRequest: null,
    waybillData: null,
    dependeceOrder: null,
    dependeceTechnicalOperation: null,
    carsList: [],
    carsIndex: {},
    total_count: 0,
  },
};

export default (state = initialMissionsState, { type, payload }) => {
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
