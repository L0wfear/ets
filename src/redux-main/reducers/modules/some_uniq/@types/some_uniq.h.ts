import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { MissionSource } from 'redux-main/reducers/modules/some_uniq/mission_source/@types';

export type modelListElement = {
  body_capacity: number | null;
  full_name: string | null;
  id: number;
  load_capacity: number | null;
  max_speed: number;
  title: string | null;
};

export type IStateSomeUniq = {
  specialModelList: SpecialModel[];
  modelsList: modelListElement[];
  technicalOperationRegistryList: TechnicalOperationRegistry[];
  technicalOperationRegistryForMissionList: TechnicalOperationRegistry[];
  technicalOperationRegistryForDutyMissionList: TechnicalOperationRegistry[];
  municipalFacilityList: MunicipalFacility[],
  municipalFacilityForMissionList: MunicipalFacility[],
  municipalFacilityForDutyMissionList: MunicipalFacility[],
  missionSource: {
    list: MissionSource[];
    order_mission_source_id: number | null;
  };
};
