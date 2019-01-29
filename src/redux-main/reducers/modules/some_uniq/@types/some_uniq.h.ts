import { SpecialModel } from 'redux-main/reducers/modules/some_uniq/special_model/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';

export type IStateSomeUniq = {
  specialModelList: SpecialModel[];
  technicalOperationRegistryList: TechnicalOperationRegistry[];
  technicalOperationRegistryForMissionList: TechnicalOperationRegistry[];
  technicalOperationRegistryForDutyMissionList: TechnicalOperationRegistry[];
  municipalFacilityList: MunicipalFacility[],
  municipalFacilityForMissionList: MunicipalFacility[],
  municipalFacilityForDutyMissionList: MunicipalFacility[],
};
