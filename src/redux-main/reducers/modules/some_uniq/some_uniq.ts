import { createPath } from 'redux-main/redux-utils';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

const SOME_UNIQ = createPath('SOME_UNIQ');

export const SOME_UNIQ_SET_DATA = SOME_UNIQ`SET_DATA`;

export const initialState: IStateSomeUniq = {
  specialModelList: [],
  modelsList: [],
  technicalOperationRegistryList: [],
  technicalOperationRegistryForMissionList: [],
  technicalOperationRegistryForDutyMissionList: [],
  municipalFacilityList: [],
  municipalFacilityMeasureUnitList: [],
  municipalFacilityForMissionList: [],
  municipalFacilityForDutyMissionList: [],
  missionSource: {
    list: [],
    order_mission_source_id: null,
  },
  maintenanceWorkList: [],
  cleanCategoriesList: [],
  cleaningRatePropertieList: [],
  missionCancelReasonsList: [],
  geozoneMunicipalFacility: {
    list: [],
    byId: null,
  },
  workKindList: [],
  technicalOperationObjectsList: [],
  technicalOperationTypesList: [],
  sensorTypeList: [],
  measureUnitList: [],

  refillTypeList: [],
  carsTravelTimeList: [],
  tracksCaching: null,

  edcRequestInfoList: [],
  workModeList: [],
  inspectionConfig: null,

  normList: [],
  consumableMaterialCountMissionList: [],
  moscowTimeServer: {
    timestamp: null,
    date: '',
  },
  reasonList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SOME_UNIQ_SET_DATA: {
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
